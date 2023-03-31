import { PaymasterAPI } from '@humanwallet/sdk';
import * as encryptor from '@metamask/browser-passworder';
import { ethers, Wallet } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { DeserializeState, HumanAccountData, KeyringSerialisedState } from '../types/account';
import HumanAccountClientAPI from '../utils/account-api';
import { BUNDLER_URL, ENTRYPOINT_ADDRESS, RPC_URL } from '../utils/constants';
import { getGasFee } from '../utils/getGasFee';
import { getHttpRpcClient } from '../utils/getHttpRpcClient';
import { getHumanAccount } from '../utils/getHumanAccount';
import { getVerifyingPaymaster, paymasterAPI } from '../utils/getPaymaster';
import { printOp } from '../utils/opUtils';

interface KeyringContext {
  keyrings: { [address: string]: HumanAccountClientAPI };

  status: 'locked' | 'unlocked' | 'uninitialized';
  error: string | undefined;

  paymasterAPI: PaymasterAPI | undefined;

  accounts: HumanAccountData[];
  selectedAccount?: HumanAccountClientAPI | undefined;

  unlockVault(password?: string): Promise<void>;

  initDeviceWithPin: ({
    pin,
    accountUsername,
    ownerSigner,
  }: {
    pin: string;
    accountUsername: string;
    ownerSigner: Wallet;
  }) => Promise<boolean>;
}

export const KeyringContext = createContext<KeyringContext>({
  keyrings: {},
  error: undefined,
  status: 'locked',

  paymasterAPI: undefined,

  accounts: [],
  selectedAccount: undefined,
  unlockVault: () => Promise.resolve(),
  initDeviceWithPin: () => Promise.resolve(false),
});

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const bundler = await getHttpRpcClient(provider, BUNDLER_URL, ENTRYPOINT_ADDRESS);

type Keyrings = { [address: string]: HumanAccountClientAPI };

export const KeyringContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [appKeyrings, setAppKeyrings] = useState<Keyrings>({});
  const [vault, setVault] = useState<string>(localStorage.getItem('vault') ?? '');
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'uninitialized'>('uninitialized');
  const [error, setError] = useState<string | undefined>(undefined);

  const [accounts, setAccounts] = useState<HumanAccountData[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<HumanAccountClientAPI>();
  const [deviceWallet, setDeviceWallet] = useState<ethers.Wallet>();

  useEffect(() => {
    if (status === 'uninitialized') {
      if (vault) {
        setStatus('locked');
      } else {
        setStatus('uninitialized');
      }
    }
  }, [status]);

  const unlockVault = async (password?: string) => {
    if (!vault) {
      setError('Vault is not initialized');
      throw new Error('Vault is not initialized');
    }

    if (status !== 'locked') {
      setError('Vault is already unlocked');
      throw new Error('Vault is already unlocked');
    }

    if (!password) {
      throw new Error('PIN is required to unlock wallet');
    } else {
      try {
        const result = await encryptor.decryptWithDetail(password, vault);

        const _vault: any = result.vault;
        const _keyrings = await Promise.all(_vault.map(_restoreKeyring));

        console.debug(_keyrings);
        // @ts-ignore
        setAppKeyrings(_keyrings);
        setStatus('unlocked');
      } catch (e) {
        throw new Error('Incorrect password');
      }
    }
  };

  const encryptVault = async (password: string, _keyrings: Keyrings) => {
    if (!password) {
      throw new Error('Cannot persist vault without password and encryption key');
    }
    const serializedKeyrings: KeyringSerialisedState[] = await Promise.all(
      Object.values(_keyrings).map(async (keyring) => {
        const [username, address, ownerAddress, data] = await Promise.all([
          keyring.username,
          keyring.getAccountAddress(),
          keyring.ownerAddress,
          keyring.serialize(),
        ]);

        return { username, address, ownerAddress, data };
      })
    );

    console.log('ENCRYPT:', serializedKeyrings, _keyrings);

    const { vault: newVault, exportedKeyString } = await encryptor.encryptWithDetail(password, serializedKeyrings);

    console.log(vault);

    // Note: these keys and salt can be used with webAuthn to unlock the vault using biometrics
    // encryptionKey = exportedKeyString;
    // encryptionSalt = JSON.parse(newVault).salt;

    localStorage.setItem('vault', newVault);
    setVault(newVault);
  };

  const initDeviceWithPin = async ({
    pin,
    accountUsername,
    ownerSigner,
  }: {
    pin: string;
    accountUsername: string;
    ownerSigner: Wallet;
  }) => {
    if (!accountUsername) throw new Error('Cannot initialise device without account username');
    if (!ownerSigner) throw new Error('Cannot initialise device without owner signer');
    if (!pin) throw new Error('Cannot initialise device without pin');
    if (!/^\d{6}$/.test(pin)) throw new Error('Invalid pin');

    const ownerSignerAcc = await getHumanAccount({
      provider: provider,
      accountUsername,
      ownerAddress: await ownerSigner.getAddress(),
      ownerWallet: ownerSigner,
      signerWallet: ownerSigner,
      entryPointAddress: ENTRYPOINT_ADDRESS,
      paymasterAPI: paymasterAPI,
    });
    const deviceAcount = await getHumanAccount({
      provider: provider,
      accountUsername,
      ownerAddress: await ownerSigner.getAddress(),
      entryPointAddress: ENTRYPOINT_ADDRESS,
      paymasterAPI: paymasterAPI,
    });
    const deviceAddress = deviceAcount.getSignerAddress();
    const deviceWallet = deviceAcount.signerWallet;

    const accountContract = await ownerSignerAcc._getAccountContract();

    const code = await provider.getCode(accountContract.address);
    const isAccountDeployed = code !== '0x';
    const isDeviceRegistered = isAccountDeployed && (await accountContract.deviceKeys(deviceAddress));

    if (!isAccountDeployed || !isDeviceRegistered) {
      console.log('===registering device key', deviceAddress, 'for account', accountUsername, accountContract.address);
      const registerRequestHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(['address'], [deviceAddress])
      );

      // sign the public key with the account's private key
      const sig = await ownerSigner.signMessage(ethers.utils.arrayify(registerRequestHash));

      const registerOp = await ownerSignerAcc.createSignedUserOp({
        target: accountContract.address,
        value: 0,
        data: accountContract.interface.encodeFunctionData('registerDeviceKey', [deviceAddress, sig]),
        ...(await getGasFee(provider)),
      });
      console.log(`Signed UserOperation: ${await printOp(registerOp)}`);

      const uoHash = await bundler.sendUserOpToBundler(registerOp);
      console.log(`Operation hash: ${uoHash}`);

      // save the keyring
      const _keyring = await _newKeyring(accountUsername, accountContract.address, await ownerSigner.getAddress(), {
        signerAddress: await deviceWallet.getAddress(),
        signerKey: deviceWallet.privateKey,
      });
      const newKeyrings: Keyrings = { ...appKeyrings, [accountUsername]: _keyring };
      console.log('keyring', _keyring);
      encryptVault(pin, newKeyrings);
      setDeviceWallet(deviceWallet);
      setAppKeyrings(newKeyrings);

      console.log('Waiting for transaction...');
      const txHash = await ownerSignerAcc.getUserOpReceipt(uoHash);
      console.log(`Transaction hash: ${txHash}`);

      if (!txHash) {
        console.error('Device registration op error!!!');
        return false;
      }

      console.log('Waiting for transaction to be mined...');
      await provider.waitForTransaction(txHash);

      console.log('Device registered');

      return true;
    } else {
      console.log('device already registered');

      const _keyring = await _newKeyring(accountUsername, accountContract.address, await ownerSigner.getAddress(), {
        signerAddress: await deviceWallet.getAddress(),
        signerKey: deviceWallet.privateKey,
      });

      const newKeyrings: Keyrings = {
        ...appKeyrings,
        [accountUsername]: _keyring,
      };
      console.log('keyring', newKeyrings);

      encryptVault(pin, newKeyrings);
      setDeviceWallet(deviceWallet);
      setAppKeyrings(newKeyrings);

      return true;
    }
  };

  const _restoreKeyring = async (serialized: KeyringSerialisedState): Promise<HumanAccountClientAPI | undefined> => {
    const { username, address, data, ownerAddress } = serialized;

    const _keyring = await _newKeyring(username, address, ownerAddress, data.data);

    setAppKeyrings((keyrings) => ({ ...keyrings, [username]: _keyring }));

    return _keyring;
  };

  const _newKeyring = async (
    username: string,
    address: string,
    ownerAddress: string,
    data: DeserializeState['data']
  ): Promise<HumanAccountClientAPI> => {
    if (!data) {
      throw new Error('Keyring data is required');
    }
    if (!provider) {
      throw new Error('Provider is required');
    }

    const account = getHumanAccount({
      provider: provider,
      accountUsername: username,
      ownerAddress: ownerAddress,
      entryPointAddress: ENTRYPOINT_ADDRESS,
      paymasterAPI: paymasterAPI,
      deserializeState: { data },
    });

    return account;
  };

  return (
    <KeyringContext.Provider
      value={{
        keyrings: appKeyrings,
        status,
        error,
        paymasterAPI,
        accounts,
        selectedAccount,
        unlockVault,
        initDeviceWithPin,
      }}>
      {children}
    </KeyringContext.Provider>
  );
};

export const useKeyringContext = () => useContext(KeyringContext);

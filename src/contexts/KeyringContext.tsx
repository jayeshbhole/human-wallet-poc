import { PaymasterAPI } from '@humanwallet/sdk';
import * as encryptor from '@metamask/browser-passworder';
import { ethers, Signer, Wallet } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { DeserializeState, HumanAccountData, KeyringSerialisedState } from '../types/account';
import HumanAccountClientAPI from '../utils/account-api';
import { BUNDLER_URL, ENTRYPOINT_ADDRESS, RPC_URL } from '../utils/constants';
import { getGasFee } from '../utils/getGasFee';
import { getHttpRpcClient } from '../utils/getHttpRpcClient';
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
  const [keyrings, setKeyrings] = useState<Keyrings>({});
  const [vault, setVault] = useState<string>(localStorage.getItem('vault') ?? '');
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'uninitialized'>('uninitialized');
  const [error, setError] = useState<string | undefined>(undefined);

  const [paymasterAPI, setPaymasterAPI] = useState<PaymasterAPI>();
  const [accounts, setAccounts] = useState<HumanAccountData[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<HumanAccountClientAPI>();
  const [deviceWallet, setDeviceWallet] = useState<ethers.Wallet>();

  useEffect(() => {
    if (status === 'uninitialized') {
      if (vault) {
        setVault(vault);
        setStatus('locked');
      } else {
        setStatus('uninitialized');
      }
    }
  }, [status]);

  const unlockVault = async (password?: string) => {
    if (!vault) {
      setError('Vault is not initialized');
    }

    if (status === 'unlocked') {
      setKeyrings({});
    }

    if (!password) {
      setError('Password is required');
      return;
    } else {
      const result = await encryptor.decryptWithDetail(password, vault);

      const _vault: any = result.vault;
      const _keyrings = await Promise.all(_vault.map(_restoreKeyring));

      // @ts-ignore
      setKeyrings(_keyrings);
    }
  };

  const encryptVault = async (password: string, keyrings: Keyrings) => {
    if (!password) {
      throw new Error('Cannot persist vault without password and encryption key');
    }
    const serializedKeyrings: KeyringSerialisedState[] = await Promise.all(
      Object.values(keyrings).map(async (keyring) => {
        const [username, address, ownerAddress, data] = await Promise.all([
          keyring.username,
          keyring.getAccountAddress(),
          keyring.ownerAddress,
          keyring.serialize(),
        ]);

        return { username, address, ownerAddress, data };
      })
    );

    console.log(serializedKeyrings);

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

    const account = new HumanAccountClientAPI({
      provider: provider,
      username: accountUsername,
      owner: ownerSigner,
      ownerAddress: await ownerSigner.getAddress(),
      signer: ownerSigner,
      entryPointAddress: ENTRYPOINT_ADDRESS,
      paymasterAPI: paymasterAPI,
      signerWallet: undefined,
    });
    const deviceAddress = account.getSignerAddress();
    const deviceWallet = account.signerWallet;
    setDeviceWallet(deviceWallet);

    const accountContract = await account._getAccountContract();

    const code = await provider.getCode(accountContract.address);
    const isAccountDeployed = code !== '0x';
    const isDeviceRegistered = isAccountDeployed && (await accountContract.deviceKeys(deviceAddress));

    if (!isAccountDeployed || !isDeviceRegistered) {
      // console.log('===registering device key', deviceAddress);
      // const registerRequestHash = ethers.utils.keccak256(
      //   ethers.utils.defaultAbiCoder.encode(['address'], [deviceAddress])
      // );

      // // sign the public key with the account's private key
      // // const sig = await ownerSigner.signMessage(ethers.utils.arrayify(registerRequestHash));

      // // const registerOp = await account.createSignedUserOp({
      // //   target: accountContract.address,
      // //   value: 0,
      // //   data: accountContract.interface.encodeFunctionData('registerDeviceKey', [deviceAddress, sig]),
      // //   ...(await getGasFee(provider)),
      // // });
      // // console.log(`Signed UserOperation: ${await printOp(registerOp)}`);

      // // const uoHash = await bundler.sendUserOpToBundler(registerOp);
      // // console.log(`Operation hash: ${uoHash}`);

      // // console.log('Waiting for transaction...');
      // // const txHash = await account.getUserOpReceipt(uoHash);
      // // console.log(`Transaction hash: ${txHash}`);

      // // if (!txHash) {
      // //   console.error('Device registration op error!!!');
      // //   return false;
      // // }

      // // console.log('Waiting for transaction to be mined...');
      // // await provider.waitForTransaction(txHash);

      console.log('Device registered');

      // save the keyring
      const _keyring = await _newKeyring(accountUsername, accountContract.address, await ownerSigner.getAddress(), {
        signerAddress: await deviceWallet.getAddress(),
        signerKey: deviceWallet.privateKey,
      });
      setKeyrings((keyrings) => ({ ...keyrings, [accountUsername]: _keyring }));
      encryptVault(pin, keyrings);

      return true;
    } else {
      console.log('device already registered');
      return true;
    }
  };

  const _restoreKeyring = async (serialized: KeyringSerialisedState): Promise<HumanAccountClientAPI | undefined> => {
    const { username, address, data, ownerAddress } = serialized;

    const _keyring = await _newKeyring(username, address, ownerAddress, data.data);

    setKeyrings((keyrings) => ({ ...keyrings, [username]: _keyring }));

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

    const signerWallet = new ethers.Wallet(data.signerKey, provider);

    const account = new HumanAccountClientAPI({
      accountAddress: address,
      provider: provider,
      username: username,
      ownerAddress: ownerAddress,
      signer: signerWallet,
      signerWallet,
      entryPointAddress: ENTRYPOINT_ADDRESS,
      paymasterAPI: paymasterAPI,
    });

    return account;
  };

  return (
    <KeyringContext.Provider
      value={{
        keyrings,
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

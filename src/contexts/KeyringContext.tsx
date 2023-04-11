import { HttpRpcClient, PaymasterAPI } from '@humanwallet/sdk';
import * as encryptor from '@metamask/browser-passworder';
import { ethers, Wallet } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import { DeserializeState, KeyringSerialisedState } from '../types/account';
import HumanAccountClientAPI from '../utils/account-api';
import { BUNDLER_URL, ENTRYPOINT_ADDRESS, RPC_URL } from '../utils/constants';
import { getHttpRpcClient } from '../utils/getHttpRpcClient';
import { getHumanAccount } from '../utils/getHumanAccount';
import { paymasterAPI } from '../utils/getPaymaster';
import registerDeviceKey from '../utils/registerDeviceKey';

interface KeyringContext {
  provider: ethers.providers.JsonRpcProvider;
  bundler: HttpRpcClient | undefined;
  vault: string;
  keyrings: { [address: string]: HumanAccountClientAPI };

  status: 'locked' | 'unlocked' | 'uninitialized';
  error: string | undefined;

  paymasterAPI: PaymasterAPI | undefined;

  // accounts: HumanAccountData[];
  activeAccount?: HumanAccountClientAPI | undefined;

  checkPIN: (password: string) => Promise<boolean>;
  unlockVault(password?: string): Promise<boolean>;

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

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const KeyringContext = createContext<KeyringContext>({
  provider: provider,
  bundler: undefined,
  vault: '',
  keyrings: {},
  error: undefined,
  status: 'locked',

  paymasterAPI: undefined,

  // accounts: [],
  activeAccount: undefined,
  checkPIN: () => Promise.resolve(false),
  unlockVault: () => Promise.resolve(false),
  initDeviceWithPin: () => Promise.resolve(false),
});

type Keyrings = { [address: string]: HumanAccountClientAPI };

export const KeyringContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [appKeyrings, setAppKeyrings] = useState<Keyrings>({});
  const [vault, setVault] = useState<string>(localStorage.getItem('vault') ?? '');
  const [status, setStatus] = useState<'locked' | 'unlocked' | 'uninitialized'>('uninitialized');
  const [error, setError] = useState<string | undefined>(undefined);

  const [bundler, setBundler] = useState<HttpRpcClient | undefined>(undefined);

  // const [accounts, setAccounts] = useState<HumanAccountData[]>([]);

  const [activeAccountUsername, setActiveAccUsername] = useState<string>(
    localStorage.getItem('activeAccountUsername') ?? ''
  );
  const [activeAccount, setActiveAccount] = useState<HumanAccountClientAPI>();
  const [deviceWallet, setDeviceWallet] = useState<ethers.Wallet>();

  useEffect(() => {
    (async () => {
      const bundler = await getHttpRpcClient(provider, BUNDLER_URL, ENTRYPOINT_ADDRESS);
      setBundler(bundler);
    })();
  }, []);

  useEffect(() => {
    if (status === 'uninitialized') {
      if (vault) {
        setStatus('locked');
      } else {
        setStatus('uninitialized');
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(appKeyrings).length && !activeAccountUsername) {
      setActiveAccount(appKeyrings[Object.keys(appKeyrings)[0]]);
      setActiveAccUsername(appKeyrings[Object.keys(appKeyrings)[0]].username);
    }
  }, [appKeyrings, activeAccountUsername]);

  const checkPIN = async (password: string) => {
    if (!vault) {
      throw new Error('Vault is not initialized');
    }

    try {
      const result = await encryptor.decryptWithDetail(password, vault);

      const _vault: any = result.vault;
      return true;
    } catch (error) {
      throw new Error('Invalid PIN');
    }
  };

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

        const _appKeyrings = _keyrings.reduce((acc, cur) => {
          return { ...acc, [cur.username]: cur };
        }, {});

        setAppKeyrings(_appKeyrings);
        setStatus('unlocked');

        const _activeAccUsername = activeAccountUsername ? activeAccountUsername : Object.keys(_appKeyrings)[0];
        setActiveAccUsername(_activeAccUsername);
        setActiveAccount(_appKeyrings[_activeAccUsername]);
        localStorage.setItem('activeAccountUsername', _activeAccUsername);

        return true;
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
    if (!bundler) throw new Error('Bundler is not initialized');

    const ownerSignerAcc = await getHumanAccount({
      provider: provider,
      accountUsername,
      ownerAddress: await ownerSigner.getAddress(),
      ownerWallet: ownerSigner,
      signerWallet: ownerSigner,
      entryPointAddress: ENTRYPOINT_ADDRESS,
    });

    const deviceAcount = await getHumanAccount({
      provider: provider,
      accountUsername,
      ownerAddress: await ownerSigner.getAddress(),
      entryPointAddress: ENTRYPOINT_ADDRESS,
      // paymasterAPI: paymasterAPI,
    });
    const deviceAddress = deviceAcount.getSignerAddress();
    const deviceWallet = deviceAcount.signerWallet;

    const accountContract = await ownerSignerAcc._getAccountContract();

    const code = await provider.getCode(accountContract.address);
    const isAccountDeployed = code !== '0x';
    const isDeviceRegistered = isAccountDeployed && (await accountContract.deviceKeys(deviceAddress));

    if (!isAccountDeployed || !isDeviceRegistered) {
      // ownerSignerAcc.paymasterAPI = paymasterAPI;
      // if (!isAccountDeployed) {
      //   ownerSignerAcc.paymasterAPI = paymasterAPI;
      // }
      const res = await registerDeviceKey({
        provider,
        accountUsername,
        accountContract,
        ownerSigner,
        humanAccount: ownerSignerAcc,
        deviceAddress,
        bundler,
      });

      if (!res) throw new Error('Failed to register device key');

      console.log('KEYRING: Device registered');
    } else {
      // add delay of 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('KEYRING: Device already registered');
    }

    // save the keyring
    const _keyring = await _newKeyring(accountUsername, accountContract.address, await ownerSigner.getAddress(), {
      signerAddress: await deviceWallet.getAddress(),
      signerKey: deviceWallet.privateKey,
    });
    const newKeyrings: Keyrings = { ...appKeyrings, [accountUsername]: _keyring };
    console.log('KEYRING:', _keyring);

    encryptVault(pin, newKeyrings);
    setDeviceWallet(deviceWallet);
    setAppKeyrings(newKeyrings);
    setStatus('unlocked');

    setActiveAccount(newKeyrings[accountUsername]);
    setActiveAccUsername(accountUsername);
    localStorage.setItem('activeAccountUsername', accountUsername);

    return true;
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
      // paymasterAPI: paymasterAPI,
      deserializeState: { data },
    });

    return account;
  };

  return (
    <KeyringContext.Provider
      value={{
        provider,
        bundler,
        vault,
        keyrings: appKeyrings,
        status,
        error,
        paymasterAPI,
        // accounts,
        activeAccount: activeAccount,
        checkPIN,
        unlockVault,
        initDeviceWithPin,
      }}>
      {children}
    </KeyringContext.Provider>
  );
};

export const useKeyringContext = () => useContext(KeyringContext);

import { Provider } from '@ethersproject/providers';
import { HttpRpcClient, PaymasterAPI } from '@humanwallet/sdk';
import * as encryptor from '@metamask/browser-passworder';
import { ethers } from 'ethers';
import { AccountApiType, AccountBalance } from '../types/account';
import { EVMNetwork } from '../types/network';
import { AccountImplementation } from './constants';

export type Vault = {
  vault: string;
  encryptionKey?: string;
  encryptionSalt?: string;
};
export type KeyringSerialisedState = {
  address: string;
  data: any;
};

export type AccountData = {
  address: string;
  networks: EVMNetwork[];
  ownerAddress: string;
  signerAddress: string;
  accountDeployed: boolean;
  minimumRequiredFunds: string;
  balances?: {
    [assetSymbol: string]: AccountBalance;
  };
  ens?: {
    name?: string;
    avatarURL?: string;
  };
};

export interface KeyringContextInterface {
  vault?: string;
  password?: string;
  encryptionKey?: string;
  encryptionSalt?: string;
  provider: Provider;
  paymasterAPI?: PaymasterAPI;

  status: 'locked' | 'unlocked' | 'uninitialized';
  error: string | null;

  bundler?: HttpRpcClient;

  entrypointAddress: string;

  unlockVault(
    password?: string,
    encryptionKey?: string,
    encryptionSalt?: string
  ): Promise<{ [address: string]: AccountApiType }>;

  lockVault(): Promise<void>;

  initDeviceWithPin: (pin: string) => Promise<void>;
  accounts?: AccountData[];
  selectedAddress?: string | undefined;
}

export default class Keyring {
  vault?: string | undefined;
  keyrings: {
    [address: string]: AccountApiType;
  };

  provider: Provider;
  status: 'locked' | 'unlocked' | 'uninitialized' = 'uninitialized';
  error = null;
  entrypointAddress: string;
  password?: string | undefined;
  encryptionKey?: string | undefined;
  encryptionSalt?: string | undefined;
  paymasterAPI?: PaymasterAPI | undefined;
  bundler!: HttpRpcClient;
  accounts?: AccountData[] | undefined;
  selectedAddress?: string | undefined;

  constructor(provider: string, bundler: string, readonly entryPointAddress: string, vault?: string) {
    this.keyrings = {};
    this.provider = new ethers.providers.JsonRpcBatchProvider(provider);
    this.provider
      .getNetwork()
      .then((net) => net.chainId)
      .then((chainId) => {
        this.bundler = new HttpRpcClient(bundler, entryPointAddress, chainId);
      });

    this.vault = vault;

    this.entrypointAddress = entryPointAddress;
    this.status;
  }

  async unlockVault(
    password?: string,
    encryptionKey?: string,
    encryptionSalt?: string
  ): Promise<{ [address: string]: AccountApiType }> {
    if (!this.vault) throw new Error('No vault to restore');

    let _vault: any;

    if (password) {
      const result = await encryptor.decryptWithDetail(password, this.vault);
      _vault = result.vault;
      this.password = password;
      this.encryptionKey = result.exportedKeyString;
      this.encryptionSalt = result.salt;
    } else {
      const parsedEncryptedVault = JSON.parse(this.vault);

      if (encryptionSalt !== parsedEncryptedVault.salt) {
        throw new Error('Encryption key and salt provided are expired');
      }

      const key = await encryptor.importKey(encryptionKey || '');
      _vault = await encryptor.decryptWithKey(key, parsedEncryptedVault);

      this.encryptionKey = encryptionKey;
      this.encryptionSalt = encryptionSalt;
    }

    await Promise.all(_vault.map(this._restoreKeyring));

    return this.keyrings;
  }

  async lockVault() {
    this.keyrings = {};
    this.password = undefined;
    this.encryptionKey = undefined;
    this.encryptionSalt = undefined;
  }

  async encryptVault() {
    if (!this.password && !this.encryptionKey) {
      throw new Error('Cannot persist vault without password and encryption key');
    }
    const serializedKeyrings: KeyringSerialisedState[] = await Promise.all(
      Object.values(this.keyrings).map(async (keyring) => {
        const [address, data] = await Promise.all([await keyring.getAccountAddress(), keyring.serialize()]);
        return { address, data };
      })
    );

    let vault: string;

    if (this.password) {
      const { vault: newVault, exportedKeyString } = await encryptor.encryptWithDetail(
        this.password,
        serializedKeyrings
      );
      vault = newVault;
      this.encryptionKey = exportedKeyString;
      this.encryptionSalt = JSON.parse(newVault).salt;
    } else {
      const key = await encryptor.importKey(this.encryptionKey || '');
      const vaultJSON = await encryptor.encryptWithKey(key, serializedKeyrings);
      vaultJSON.salt = this.encryptionSalt;
      vault = JSON.stringify(vaultJSON);
    }

    this.vault = vault;

    return vault;
  }

  /**
   * Restore Keyring Helper
   *
   * Attempts to initialize a new keyring from the provided serialized payload.
   * On success, returns the resulting keyring instance.
   *
   * @param {object} serialized - The serialized keyring.
   * @returns {Promise<Keyring|undefined>} The deserialized keyring or undefined if the keyring type is unsupported.
   */
  _restoreKeyring = async (serialized: KeyringSerialisedState): Promise<AccountApiType | undefined> => {
    const { address, data } = serialized;

    const keyring = await this._newKeyring(address, data);

    this.keyrings[address] = keyring;

    return keyring;
  };

  /**
   * Instantiate, initialize and return a new keyring
   *
   * The keyring instantiated is of the given `type`.
   *
   * @param {object} data - The data to restore a previously serialized keyring.
   * @returns {Promise<Keyring>} The new keyring.
   */
  async _newKeyring(address: string, data: any): Promise<AccountApiType> {
    const account = new AccountImplementation({
      provider: this.provider,
      username: address,
      owner: data.owner,
      signer: data.signer,
      entryPointAddress: this.entryPointAddress,
      paymasterAPI: this.paymasterAPI,
    });

    return account;
  }
}

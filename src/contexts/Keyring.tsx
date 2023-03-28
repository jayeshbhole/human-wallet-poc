import { HttpRpcClient, PaymasterAPI } from '@humanwallet/sdk';
import { createContext } from 'react';
import { AccountBalance } from '../types/account';
import { EVMNetwork } from '../types/network';
import { Provider } from '@ethersproject/providers';

export type Vault = {
  vault: string;
  encryptionKey?: string;
  encryptionSalt?: string;
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

const KeyringContext = createContext({});

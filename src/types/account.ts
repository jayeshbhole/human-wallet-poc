import { AnyAssetAmount } from './asset';
import { EVMNetwork } from './network';
import { HumanAccountAPI, HumanAccountApiParams } from '@humanwallet/sdk/dist/src/HumanAccountAPI';
import { Wallet } from 'ethers';
import HumanAccountClientAPI from '../utils/account-api';

type AccountBalance = {
  address: string;
  assetAmount: AnyAssetAmount;
  network: EVMNetwork;
  blockHeight?: string;
  retrievedAt: number;
  dataSource: 'alchemy' | 'local' | 'infura' | 'custom';
};

interface DeserializeState {
  data: {
    signerAddress: string;
    signerKey: string;
  };
}

interface HumanAccountApiParamsType<T> extends HumanAccountApiParams {
  context?: T;
  deserializeState?: DeserializeState;
  signerWallet: Wallet | undefined;
}

type Vault = {
  vault: string;
  encryptionKey?: string;
  encryptionSalt?: string;
};
type KeyringSerialisedState = {
  username: string;
  address: string;
  ownerAddress: string;
  data: DeserializeState;
};

type HumanAccountData = {
  address: string;
  username: string;
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

export type {
  DeserializeState,
  HumanAccountApiParamsType,
  HumanAccountData,
  AccountBalance,
  Vault,
  KeyringSerialisedState,
};

import { AnyAssetAmount } from './asset';
import { EVMNetwork } from './network';
import { UserOperationStruct } from '@humanwallet/contracts';
import { HumanAccountAPI, HumanAccountApiParams } from '@humanwallet/sdk/dist/src/HumanAccountAPI';

export type AccountBalance = {
  /**
   * The address whose balance was measured.
   */
  address: string;
  /**
   * The measured balance and the asset in which it's denominated.
   */
  assetAmount: AnyAssetAmount;
  /**
   * The network on which the account balance was measured.
   */
  network: EVMNetwork;
  /**
   * The block height at while the balance measurement is valid.
   */
  blockHeight?: string;
  /**
   * When the account balance was measured, using Unix epoch timestamps.
   */
  retrievedAt: number;
  /**
   * A loose attempt at tracking balance data provenance, in case providers
   * disagree and need to be disambiguated.
   */
  dataSource: 'alchemy' | 'local' | 'infura' | 'custom';
};

export abstract class AccountApiType extends HumanAccountAPI {
  abstract serialize: () => Promise<object>;

  // abstract signUserOpWithContext(userOp: UserOperationStruct, context?: any): Promise<UserOperationStruct>;
}

export interface AccountApiParamsType<T> extends HumanAccountApiParams {
  context?: T;
  deserializeState?: any;
}

export type AccountImplementationType = new (params: AccountApiParamsType<any>) => AccountApiType;

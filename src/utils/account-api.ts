import { BigNumber, BigNumberish, ethers, Wallet } from 'ethers';
// import {
//   SimpleAccount,
//   SimpleAccount__factory,
//   SimpleAccountFactory,
//   SimpleAccountFactory__factory,
//   UserOperationStruct,
// } from '@account-abstraction/contracts';
import { arrayify, hexConcat } from 'ethers/lib/utils';

import { AccountApiParamsType, AccountApiType } from '../types/account';
import { FACTORY_ADDRESS } from './constants';
import { HumanAccountAPI } from '@humanwallet/sdk';
import { HumanAccount, HumanAccountFactory, UserOperationStruct } from '@humanwallet/contracts';
import { TransactionDetailsForUserOp } from '@humanwallet/sdk/dist/src/TransactionDetailsForUserOp';

/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
class HumanAccountClientAPI extends HumanAccountAPI {
  name: string;
  factoryAddress?: string;
  owner: Wallet;
  index: number;

  constructor(params: AccountApiParamsType<{}>) {
    super(params);
    this.factoryAddress = FACTORY_ADDRESS;

    this.owner = params.deserializeState?.privateKey
      ? new ethers.Wallet(params.deserializeState?.privateKey)
      : ethers.Wallet.createRandom();
    this.index = 0;
    this.name = 'SimpleAccountAPI';
  }

  serialize = async (): Promise<object> => {
    return {
      privateKey: this.owner.privateKey,
    };
  };

  async createUnsignedUserOpForTransactions(transactions: TransactionDetailsForUserOp[]): Promise<UserOperationStruct> {
    const accountContract = await this._getAccountContract();
    const callData = accountContract.interface.encodeFunctionData('executeBatch', [
      transactions.map((transaction) => transaction.target),
      transactions.map((transaction) => transaction.data),
    ]);

    const callGasLimit = await this.provider.estimateGas({
      from: this.entryPointAddress,
      to: this.getAccountAddress(),
      data: callData,
    });

    const initCode = await this.getInitCode();

    const initGas = await this.estimateCreationGas(initCode);
    const verificationGasLimit = BigNumber.from(await this.getVerificationGasLimit()).add(initGas);

    let maxFeePerGas, maxPriorityFeePerGas;

    const feeData = await this.provider.getFeeData();
    maxFeePerGas = feeData.maxFeePerGas ?? 0;
    maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? 0;

    const partialUserOp: UserOperationStruct = {
      sender: await this.getAccountAddress(),
      nonce: this.getNonce(),
      initCode,
      callData,
      callGasLimit,
      verificationGasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
      paymasterAndData: '',
      preVerificationGas: 0,
      signature: '',
    };

    return {
      ...partialUserOp,
      preVerificationGas: this.getPreVerificationGas(partialUserOp),
      signature: '',
    };
  }
}

export default HumanAccountClientAPI;

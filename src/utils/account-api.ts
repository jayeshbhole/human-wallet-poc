import { UserOperationStruct } from '@humanwallet/contracts';
import { HumanAccountAPI } from '@humanwallet/sdk';
import { TransactionDetailsForUserOp } from '@humanwallet/sdk/dist/src/TransactionDetailsForUserOp';
import { BigNumber, ethers } from 'ethers';
import { DeserializeState, HumanAccountApiParamsType } from '../types/account';
import { FACTORY_ADDRESS } from './constants';

/**
 * An implementation of the BaseAccountAPI using the SimpleAccount contract.
 * - contract deployer gets "entrypoint", "owner" addresses and "index" nonce
 * - owner signs requests using normal "Ethereum Signed Message" (ether's signer.signMessage())
 * - nonce method is "nonce()"
 * - execute method is "execFromEntryPoint()"
 */
class HumanAccountClientAPI extends HumanAccountAPI {
  signerWallet: ethers.Wallet;

  constructor(params: HumanAccountApiParamsType<{}>) {
    super(params);
    this.username = params.username;
    this.factoryAddress = FACTORY_ADDRESS;

    this.signer = params.signerWallet;
    this.signerWallet = params.signerWallet;

    this.index = params.index ?? 0;
  }

  serialize = async (): Promise<DeserializeState> => {
    return {
      data: {
        signerAddress: await this.signer.getAddress(),
        signerKey: this.signerWallet.privateKey,
      },
    };
  };

  getSignerAddress = (): string => {
    return this.signerWallet.address;
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

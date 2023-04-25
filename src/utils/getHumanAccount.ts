import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers, Wallet } from 'ethers';
import { DeserializeState } from '../types/account';
import HumanAccountClientAPI from './account-api';
import { VerifyingPaymasterAPI } from './getPaymaster';

export async function getHumanAccount({
  provider,
  accountUsername,
  ownerAddress,
  ownerWallet,
  signerWallet,
  entryPointAddress,
  deserializeState,
  paymasterAPI,
}: {
  provider: JsonRpcProvider;
  accountUsername: string;
  ownerAddress: string;
  ownerWallet?: Wallet;
  signerWallet?: Wallet;
  entryPointAddress: string;
  deserializeState?: DeserializeState;
  paymasterAPI?: VerifyingPaymasterAPI;
}) {
  let _signerWallet: Wallet;

  // owner wallet is the signer
  if (ownerWallet) {
    _signerWallet = ownerWallet;
  } else {
    // owner wallet not available
    if (signerWallet) {
      // given signer
      _signerWallet = signerWallet;
    } else {
      // generate a new signer if deserialieState does not contain a key
      _signerWallet = deserializeState?.data.signerKey
        ? new ethers.Wallet(deserializeState?.data.signerKey)
        : // : new ethers.Wallet(process.env.REACT_APP_SIGNER_PRIVATE_KEY ?? '');
          ethers.Wallet.createRandom();
    }
  }

  const sw = new HumanAccountClientAPI({
    provider: provider,
    username: accountUsername,
    owner: ownerWallet,
    signer: _signerWallet,
    signerWallet: _signerWallet,
    ownerAddress: ownerAddress,
    entryPointAddress: entryPointAddress,
    // @ts-ignore
    paymasterAPI: paymasterAPI,
  });

  await sw.getAccountAddress();
  sw.accountAddress = await sw.getAccountAddress();

  // Hack: default getUserOpReceipt does not include fromBlock which causes an error for some RPC providers.
  sw.getUserOpReceipt = async (userOpHash: string, timeout = 30000, interval = 5000): Promise<string | null> => {
    const endtime = Date.now() + timeout;
    const block = await sw.provider.getBlock('latest');
    while (Date.now() < endtime) {
      // @ts-ignore
      const events = await sw.entryPointView.queryFilter(
        // @ts-ignore
        sw.entryPointView.filters.UserOperationEvent(userOpHash),
        Math.max(0, block.number - 100)
      );
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return null;
  };

  return sw;
}

// import { SimpleAccountAPI } from "@account-abstraction/sdk";
import { HumanAccountAPI, PaymasterAPI } from '@humanwallet/sdk';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';

export function getHumanAccount(
  provider: JsonRpcProvider,
  ownerKey: string,
  signingKey: string,
  entryPointAddress: string,
  factoryAddress: string,
  username: string,
  paymasterAPI?: PaymasterAPI
) {
  const ownerWallet = new ethers.Wallet(ownerKey, provider);
  const ownerSigner = ownerWallet.connect(provider);

  const opWallet = new ethers.Wallet(signingKey, provider);
  const opSigner = opWallet.connect(provider);

  const sw = new HumanAccountAPI({
    provider,
    entryPointAddress,
    owner: ownerSigner,
    factoryAddress,
    signer: opSigner,
    username,
    paymasterAPI,
  });

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

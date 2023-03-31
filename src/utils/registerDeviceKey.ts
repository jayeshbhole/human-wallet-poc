import { HttpRpcClient } from '@humanwallet/sdk';
import { ethers } from 'ethers';
import HumanAccountClientAPI from './account-api';
import { getGasFee } from './getGasFee';
import { printOp } from './opUtils';

const registerDeviceKey = async ({
  provider,
  accountUsername,
  accountContract,
  ownerSigner,
  humanAccount,
  deviceAddress,
  bundler,
}: {
  provider: ethers.providers.JsonRpcProvider;
  accountUsername: string;
  accountContract: ethers.Contract;
  ownerSigner: ethers.Signer;
  humanAccount: HumanAccountClientAPI;
  deviceAddress: string;
  bundler: HttpRpcClient;
}) => {
  console.log('===registering device key', deviceAddress, 'for account', accountUsername, accountContract.address);
  const registerRequestHash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [deviceAddress]));

  // sign the public key with the account's private key
  const sig = await ownerSigner.signMessage(ethers.utils.arrayify(registerRequestHash));

  const registerOp = await humanAccount.createSignedUserOp({
    target: accountContract.address,
    value: 0,
    data: accountContract.interface.encodeFunctionData('registerDeviceKey', [deviceAddress, sig]),
    ...(await getGasFee(provider)),
  });
  console.log(`Signed UserOperation: ${await printOp(registerOp)}`);

  const uoHash = await bundler.sendUserOpToBundler(registerOp);
  console.log(`Operation hash: ${uoHash}`);

  console.log('Waiting for transaction...');
  const txHash = await humanAccount.getUserOpReceipt(uoHash);
  console.log(`Transaction hash: ${txHash}`);

  if (!txHash) {
    console.error('Device registration op error!!!');
    return false;
  }

  console.log('Waiting for transaction to be mined...');
  await provider.waitForTransaction(txHash);
  console.log('Transaction mined!');

  return true;
};

export default registerDeviceKey;

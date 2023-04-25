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
  const registerRequestHashBytes = ethers.utils.arrayify(registerRequestHash);
  console.log('signing register request hash');

  // sign the public key with the account's private key
  const sig = await ownerSigner.signMessage(registerRequestHashBytes);
  console.log('creating signed user operation (registerDeviceKey)');

  const registerCallData = accountContract.interface.encodeFunctionData('registerDeviceKey', [deviceAddress, sig]);
  console.log('registerCallData', registerCallData);

  const opData = {
    target: accountContract.address,
    value: '',
    data: registerCallData,
    ...(await getGasFee(provider)),
  };
  console.log('opData', opData);

  const registerOp = await humanAccount.createSignedUserOp(opData);
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

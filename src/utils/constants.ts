import { CHAIN_NAMESPACES } from '@web3auth/base';

export const web3AuthClientId =
  'BP5aL_QCnyKdqyiDUCqmJRRGgqdh-FnqqkolYBKgJczUewBUZyimowuOvOTTFnDYniyp-LU46d7J8N2RpcpkiVc'; // get from https://dashboard.web3auth.io
export const verifier = 'wallet-firebase';
export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x5',
  rpcTarget: 'https://rpc.ankr.com/eth_goerli',
  displayName: 'Goerli Testnet',
  blockExplorer: 'https://goerli.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};

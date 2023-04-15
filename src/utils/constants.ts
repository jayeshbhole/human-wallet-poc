import { CHAIN_NAMESPACES } from '@web3auth/base';

const web3AuthClientId = 'BP5aL_QCnyKdqyiDUCqmJRRGgqdh-FnqqkolYBKgJczUewBUZyimowuOvOTTFnDYniyp-LU46d7J8N2RpcpkiVc'; // get from https://dashboard.web3auth.io
const verifier = 'wallet-firebase';
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x5',
  rpcTarget: process.env.REACT_APP_RPC_URL ?? 'https://rpc.ankr.com/eth_goerli',
  displayName: 'Goerli Testnet',
  blockExplorer: 'https://goerli.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};

const FACTORY_ADDRESS = '0xA1c7Be6dab92C16C70400cb98e651E3ff94b7c37';
const ENTRYPOINT_ADDRESS = '0x0576a174D229E3cFA37253523E645A78A0C91B57';
const PAYMASTER_URL = process.env.REACT_APP_PAYMASTER_URL ?? '';
const RPC_URL = process.env.REACT_APP_RPC_URL ?? '';
const BUNDLER_URL = process.env.REACT_APP_BUNDLER_URL ?? '';
const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/jayeshbhole/humanaccounts';

enum SUPPORTED_NETWORKS {
  // MAINNET = '0x1',
  GOERLI = '0x5',
}

const NETWORK_IMAGES = {
  '0x1': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  '0x5': 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
};

export {
  web3AuthClientId,
  verifier,
  chainConfig,
  FACTORY_ADDRESS,
  ENTRYPOINT_ADDRESS,
  PAYMASTER_URL,
  RPC_URL,
  BUNDLER_URL,
  SUBGRAPH_URL,
  NETWORK_IMAGES,
  SUPPORTED_NETWORKS,
};

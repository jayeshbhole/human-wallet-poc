// import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { createContext, useEffect, useState } from 'react';
import { app, auth } from '../utils/firebase';
import { getAuth } from 'firebase/auth';
import { Web3Auth } from '@web3auth/single-factor-auth';
import { Web3AuthCore } from '@web3auth/core';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';

enum OnboardingMode {
  NONE = 'none',
  LOGIN = 'login',
  DEPLOY = 'deploy',
}
enum OnboardingStep {
  PHONE = 'phone',
  USERNAME = 'username',
  PIN = 'pin',
  CREATED = 'created',
  LOGIN = 'login',
  LOADED = 'loaded',
}

interface OnboardingContext {
  step: number;
  mode: OnboardingMode;
  setStep: (step: number) => void;
  setMode: (mode: OnboardingStep) => void;
}

const OnboardingContext = createContext<OnboardingContext>({
  step: 0,
  mode: OnboardingMode.NONE,
  setStep: (step: number) => {},
  setMode: (mode: OnboardingStep) => {},
});

// flows
// onboarding -> phone -> username -> pin -> created
// onboarding -> phone -> login -> pin -> loaded

const web3AuthClientId = 'BP5aL_QCnyKdqyiDUCqmJRRGgqdh-FnqqkolYBKgJczUewBUZyimowuOvOTTFnDYniyp-LU46d7J8N2RpcpkiVc'; // get from https://dashboard.web3auth.io
const verifier = 'wallet-firebase';
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x5',
  rpcTarget: 'https://rpc.ankr.com/eth_goerli',
  displayName: 'Goerli Testnet',
  blockExplorer: 'https://goerli.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};

const OnboardingContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<OnboardingMode>(OnboardingMode.NONE);

  const [web3authCore, setWeb3authCore] = useState<Web3AuthCore | null>(null);
  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [usesSfaSDK, setUsesSfaSDK] = useState(false);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       // Initialising Web3Auth Single Factor Auth SDK
  //       const web3authSfa = new Web3Auth({
  //         clientId: web3AuthClientId, // Get your Client ID from Web3Auth Dashboard
  //         chainConfig,
  //         web3AuthNetwork: 'cyan',
  //       });
  //       setWeb3authSFAuth(web3authSfa);
  //       web3authSfa.init();

  //       // Initialising Web3Auth Core SDK
  //       const web3authCore = new Web3AuthCore({
  //         clientId: web3AuthClientId,
  //         chainConfig,
  //         web3AuthNetwork: 'cyan',
  //         useCoreKitKey: true,
  //       });

  //       const openloginAdapter = new OpenloginAdapter({
  //         adapterSettings: {
  //           loginConfig: {
  //             jwt: {
  //               name: 'Human wallet login',
  //               verifier,
  //               typeOfLogin: 'jwt',
  //               clientId: web3AuthClientId,
  //             },
  //           },
  //         },
  //       });
  //       web3authCore.configureAdapter(openloginAdapter);
  //       setWeb3authCore(web3authCore);
  //       await web3authCore.init();

  //       if (web3authCore.provider) {
  //         setProvider(web3authCore.provider);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   init();
  // }, []);

  // handlePhoneSubmit
  const handlePhoneSubmit = (phoneNumber: string) => {
    if (!phoneNumber) {
      throw new Error('Phone number is invalid');
    }
  };
  // handlePhoneVerify
  // handleUsernameSubmit
  // handlePinSubmit
  // deployAccount

  return (
    <OnboardingContext.Provider
      value={{
        step: 0,
        mode: OnboardingMode.NONE,
        setStep: (step: number) => {},
        setMode: (mode: OnboardingStep) => {},
      }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContextProvider;

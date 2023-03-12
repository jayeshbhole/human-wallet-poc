// import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { createContext, useEffect, useRef, useState } from 'react';
import { app, auth } from '../utils/firebase';
import { ConfirmationResult, RecaptchaVerifier, User, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { Web3Auth } from '@web3auth/single-factor-auth';
import { Web3AuthCore } from '@web3auth/core';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { redirect } from 'react-router-dom';

export enum OnboardingMode {
  NONE = 'none',
  LOGIN = 'login',
  DEPLOY = 'deploy',
}
// flows
// onboarding -> phone -> username -> pin -> created
// onboarding -> phone -> login -> pin -> loaded
export enum OnboardingStep {
  NONE = 'none',
  PHONE_INPUT = 'input',
  PHONE_VERIFY = 'verify',
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
  handlePhoneSubmit: (phoneNumber: string) => void;
  handleVerifyOTP: (otp: string) => void;
}

export const OnboardingContext = createContext<OnboardingContext>({
  step: 0,
  mode: OnboardingMode.NONE,
  setStep: (step: number) => {},
  setMode: (mode: OnboardingStep) => {},
  handlePhoneSubmit: (phoneNumber: string) => {},
  handleVerifyOTP: (otp: string) => {},
});

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
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.PHONE_INPUT);
  const [mode, setMode] = useState<OnboardingMode>(OnboardingMode.NONE);

  const [web3authCore, setWeb3authCore] = useState<Web3AuthCore | null>(null);
  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [usesSfaSDK, setUsesSfaSDK] = useState(false);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  const recaptchaContainer = useRef<HTMLDivElement>(null);
  const [applicationVerifier, setApplicationVerifier] = useState<RecaptchaVerifier | null>(null);

  // phone-firebase states
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // initialise recaptcha verifier
  useEffect(() => {
    if (!recaptchaContainer.current) return;

    setApplicationVerifier(
      new RecaptchaVerifier(
        recaptchaContainer.current as HTMLDivElement,
        {
          size: 'invisible',
        },
        auth
      )
    );
  }, [recaptchaContainer.current]);

  // initialise web3auth
  useEffect(() => {
    const init = async () => {
      try {
        // Initialising Web3Auth Single Factor Auth SDK
        const web3authSfa = new Web3Auth({
          clientId: web3AuthClientId, // Get your Client ID from Web3Auth Dashboard
          chainConfig,
          web3AuthNetwork: 'cyan',
        });
        setWeb3authSFAuth(web3authSfa);
        web3authSfa.init();

        // Initialising Web3Auth Core SDK
        const web3authCore = new Web3AuthCore({
          clientId: web3AuthClientId,
          chainConfig,
          web3AuthNetwork: 'cyan',
          useCoreKitKey: true,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: 'popup',
            loginConfig: {
              jwt: {
                name: 'Human wallet login',
                verifier,
                typeOfLogin: 'jwt',
                clientId: web3AuthClientId,
              },
            },
          },
        });
        web3authCore.configureAdapter(openloginAdapter);
        setWeb3authCore(web3authCore);
        await web3authCore.init();

        if (web3authCore.provider) {
          setProvider(web3authCore.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // handlePhoneSubmit
  const handlePhoneSubmit = async (phoneNumber: string) => {
    if (!phoneNumber) {
      throw new Error('Phone number is invalid');
    }
    await requestOTP(phoneNumber);
    setStep(OnboardingStep.PHONE_VERIFY);
    redirect('/onboarding/phone/verify');
  };

  const requestOTP = async (phoneNumber: string) => {
    if (!applicationVerifier) {
      console.log('applicationVerifier not initialized yet');
      return;
    }
    try {
      console.log('requestOTP', phoneNumber);

      const res = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
      console.log(res);

      setConfirmationResult(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // handleVerifyOTP
  const handleVerifyOTP = async (verificationCode: string) => {
    if (!confirmationResult || !verificationCode) {
      console.log('confirmationResult not initialized yet or verification code not entered');
      return;
    }

    try {
      // verify otp
      const loginRes = await confirmationResult.confirm(verificationCode);
      console.log('login details', loginRes);

      setUser(loginRes.user);
    } catch (err) {
      console.error(err);
    }
  };

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
        handlePhoneSubmit,
        handleVerifyOTP,
      }}>
      {children}
      <div
        id="recaptcha-container"
        className="hidden"
        ref={recaptchaContainer}></div>
    </OnboardingContext.Provider>
  );
};

export default OnboardingContextProvider;

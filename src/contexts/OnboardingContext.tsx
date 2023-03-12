// import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { Web3Auth } from '@web3auth/single-factor-auth';
import { ConfirmationResult, RecaptchaVerifier, User, signInWithPhoneNumber } from 'firebase/auth';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';

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

export const flows = {
  [OnboardingMode.NONE]: [OnboardingStep.NONE, OnboardingStep.PHONE_INPUT, OnboardingStep.PHONE_VERIFY],
  [OnboardingMode.LOGIN]: [OnboardingStep.LOGIN, OnboardingStep.PIN, OnboardingStep.LOADED],
  [OnboardingMode.DEPLOY]: [OnboardingStep.USERNAME, OnboardingStep.PIN, OnboardingStep.CREATED],
};

interface OnboardingContext {
  step: number;
  mode: OnboardingMode;
  canResendOTP: boolean;
  firebaseUser: User | null;
  provider: SafeEventEmitterProvider | null;
  ownerPubKey: string;
  setStep: (step: number) => void;
  setMode: (mode: OnboardingStep) => void;
  handlePhoneSubmit: (phoneNumber: string) => void;
  handleVerifyOTP: (otp: string) => void;
  requestOTP: (phoneNumber: string) => Promise<ConfirmationResult | undefined>;
  setWeb3AuthProvider: () => Promise<SafeEventEmitterProvider | undefined>;
  setWeb3AuthProviderAndNavigate: () => Promise<void>;
}

export const OnboardingContext = createContext<OnboardingContext>({
  step: 0,
  mode: OnboardingMode.NONE,
  canResendOTP: false,
  firebaseUser: null,
  provider: null,
  ownerPubKey: '',
  setStep: (step: number) => {},
  setMode: (mode: OnboardingStep) => {},
  handlePhoneSubmit: (phoneNumber: string) => {},
  handleVerifyOTP: (otp: string) => {},
  requestOTP: (phoneNumber: string) => Promise.resolve(undefined),
  setWeb3AuthProvider: () => Promise.resolve(undefined),
  setWeb3AuthProviderAndNavigate: () => Promise.resolve(),
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

  const [web3authSFAuth, setWeb3authSFAuth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [ownerPubKey, setOwnerPubKey] = useState<string>('');

  const recaptchaContainer = useRef<HTMLDivElement>(null);
  const [applicationVerifier, setApplicationVerifier] = useState<RecaptchaVerifier | null>(null);

  // phone-firebase states
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const [canResendOTP, setCanResendOTP] = useState<boolean>(true);

  const navigate = useNavigate();

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

  // set firebaseUser if auth already present
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user);
      }
    });
    return unsubscribe;
  });

  // initialise web3auth
  useEffect(() => {
    const init = async () => {
      try {
        // Initialising Web3Auth Single Factor Auth SDK
        const web3authSfa = new Web3Auth({
          clientId: web3AuthClientId, // Get your Client ID from Web3Auth Dashboard
          chainConfig,
          web3AuthNetwork: 'testnet',
        });
        setWeb3authSFAuth(web3authSfa);
        setProvider(web3authSfa.provider);

        web3authSfa.init();
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
    navigate('/onboarding/phone/verify');
  };

  const requestOTP = useCallback(
    async (phoneNumber: string) => {
      if (!applicationVerifier) {
        console.error('applicationVerifier not initialized yet');
        return;
      }

      if (!canResendOTP) {
        console.error('OTP request throttled. Please wait and retry');
        return;
      }

      try {
        const res = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
        setCanResendOTP(false);
        setTimeout(() => {
          setCanResendOTP(true);
        }, 30000);

        console.debug(res);

        setConfirmationResult(res);
        return res;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [applicationVerifier, setCanResendOTP, setConfirmationResult]
  );

  // handleVerifyOTP
  const handleVerifyOTP = async (verificationCode: string) => {
    if (!confirmationResult || !verificationCode) {
      console.log('confirmationResult not initialized yet or verification code not entered');
      return;
    }
    if (!web3authSFAuth) {
      console.error('Web3Auth Single Factor Auth SDK not initialized yet');
      return;
    }
    try {
      // verify otp
      const loginRes = await confirmationResult.confirm(verificationCode);
      console.log('login details', loginRes);

      setFirebaseUser(loginRes.user);
      navigate('/onboarding/web3Auth');
    } catch (err) {
      console.error(err);
    }
  };

  const setWeb3AuthProvider = useCallback(async () => {
    if (!firebaseUser || !web3authSFAuth) {
      console.error('Firebase/web3AuthSFA not initialized yet');
      return;
    }

    const idToken = await firebaseUser.getIdToken(true);

    if (!web3authSFAuth.provider) {
      console.log('provider not set yet. requesting id token');

      // get web3auth token
      const provider = await web3authSFAuth
        .connect({
          verifier: 'wallet-firebase',
          verifierId: firebaseUser.uid,
          idToken: idToken,
        })
        .catch((err) => {
          console.error(err);
        });

      if (provider) {
        // get accounts
        const accounts = await provider.request({ method: 'eth_accounts' });
        console.log('ETH Accounts', accounts);

        // @ts-ignore
        setOwnerPubKey(accounts?.[0]);

        return provider;
      }
    } else {
      console.log('provider already set. requesting private key');

      setProvider(web3authSFAuth.provider);

      // get accounts
      const accounts = await web3authSFAuth.provider.request({ method: 'eth_accounts' });
      console.log('ETH Accounts', accounts);

      // @ts-ignore
      setOwnerPubKey(accounts?.[0]);
      return web3authSFAuth.provider;
    }
  }, [firebaseUser, web3authSFAuth, setOwnerPubKey, setProvider]);

  const setWeb3AuthProviderAndNavigate = useCallback(async () => {
    console.log('setWeb3AuthProviderAndNavigate');
    const provider = await setWeb3AuthProvider();
    if (provider) {
      navigate('/onboarding/fetchAccounts');
    }
  }, [setWeb3AuthProvider, setMode, navigate]);

  // handleUsernameSubmit
  // handlePinSubmit
  // deployAccount

  return (
    <OnboardingContext.Provider
      value={{
        step: 0,
        mode: OnboardingMode.NONE,
        canResendOTP,
        firebaseUser,
        provider,
        ownerPubKey,
        setStep: (step: number) => {},
        setMode: (mode: OnboardingStep) => {},
        handlePhoneSubmit,
        handleVerifyOTP,
        setWeb3AuthProvider,
        setWeb3AuthProviderAndNavigate,
        requestOTP,
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

// import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { Web3Auth } from '@web3auth/single-factor-auth';
import { ethers, Signer, Wallet } from 'ethers';
import { ConfirmationResult, RecaptchaVerifier, User, signInWithPhoneNumber } from 'firebase/auth';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { web3AuthClientId, chainConfig } from '../utils/constants';
import { auth } from '../utils/firebase';
import { useKeyringContext } from './KeyringContext';

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
  USERNAME = 'select-username',
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
  web3Auth: Web3Auth | undefined;
  ownerPubKey: string;
  setStep: (step: number) => void;
  setMode: (mode: OnboardingStep) => void;
  handlePhoneSubmit: (phoneNumber: string) => Promise<boolean>;
  handleVerifyOTP: (otp: string) => void;
  getOwnerKeysAndNavigate: (web3Auth?: Web3Auth) => Promise<void>;
  selectUsername: (username: string) => Promise<void>;
  handlePinSubmit: (pin: string) => Promise<void>;
}

export const OnboardingContext = createContext<OnboardingContext>({
  step: 0,
  mode: OnboardingMode.NONE,
  canResendOTP: false,
  firebaseUser: null,
  web3Auth: undefined,
  ownerPubKey: '',

  setStep: (step: number) => {},
  setMode: (mode: OnboardingStep) => {},

  handlePhoneSubmit: (phoneNumber: string) => Promise.resolve(false),
  handleVerifyOTP: (otp: string) => {},
  getOwnerKeysAndNavigate: (web3Auth?: Web3Auth) => Promise.resolve(),
  selectUsername: (username: string) => Promise.resolve(),
  handlePinSubmit: (pin: string) => Promise.resolve(),
});

const OnboardingContextProvider = ({ children }: { children: React.ReactNode }) => {
  // const [step, setStep] = useState<OnboardingStep>(OnboardingStep.PHONE_INPUT);
  // const [mode, setMode] = useState<OnboardingMode>(OnboardingMode.NONE);

  const [firebaseUser, setFirebaseUser] = useState<User>(auth.currentUser as User);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [applicationVerifier, setApplicationVerifier] = useState<RecaptchaVerifier | null>(null);

  const [web3Auth, setWeb3Auth] = useState<Web3Auth | undefined>();
  const [ownerWallet, setOwnerWallet] = useState<Wallet>();
  const [ownerPubKey, setOwnerPubKey] = useState<string>('');

  const [accountUsername, setAccountUsername] = useState<string>('');
  const [canResendOTP, setCanResendOTP] = useState<boolean>(true);

  // other hooks
  const navigate = useNavigate();
  const { initDeviceWithPin } = useKeyringContext();

  const recaptchaContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // initialise web3auth
    const _web3authSFAuth = new Web3Auth({
      clientId: web3AuthClientId,
      chainConfig,
      web3AuthNetwork: 'testnet',
    });
    _web3authSFAuth.init();

    setWeb3Auth(() => {
      console.debug('USE_EFFECT: setting web3Auth SFA');
      return _web3authSFAuth;
    });
  }, []);
  // set firebaseUser if auth already present
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user);
        console.debug('FIREBASE: found user logged in');
      }
    });
    return unsubscribe;
  }, []);

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

  const _requestOTP = useCallback(
    async (phoneNumber: string) => {
      if (!applicationVerifier) {
        console.debug('CONTEXT: applicationVerifier not initialized yet');
        return;
      }

      if (!canResendOTP) {
        console.debug('CONTEXT-FIREBASE: OTP request throttled. Please wait and retry');
        return;
      }

      try {
        const res = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
        setCanResendOTP(false);
        setTimeout(() => {
          setCanResendOTP(true);
        }, 30000);
        // console.debug(res);
        setConfirmationResult(res);
        return res;
      } catch (err) {
        console.debug(err);
        throw err;
      }
    },
    [applicationVerifier, canResendOTP, setCanResendOTP, setConfirmationResult]
  );

  // handlePhoneSubmit
  const handlePhoneSubmit = useCallback(
    async (phoneNumber: string) => {
      if (!phoneNumber) {
        throw new Error('Phone number is invalid');
      }
      await _requestOTP(phoneNumber);
      // setStep(OnboardingStep.PHONE_VERIFY);
      navigate('/onboarding/phone-verify');

      return true;
    },
    [_requestOTP, navigate]
  );

  // handleVerifyOTP
  const handleVerifyOTP = useCallback(
    async (verificationCode: string) => {
      if (!confirmationResult || !verificationCode) {
        console.log('confirmationResult not initialized yet or verification code not entered');
        return;
      }
      try {
        const loginRes = await confirmationResult.confirm(verificationCode);
        setFirebaseUser(loginRes.user);

        navigate('/onboarding/web3Auth');
      } catch (err) {
        console.debug(err);
      }
    },
    [confirmationResult]
  );

  const getOwnerKeys = useCallback(
    async (_web3Auth?: Web3Auth) => {
      if (!web3Auth) {
        console.error('WEB3AUTH: web3auth not initialized yet');
        return;
      }

      if (web3Auth.provider) {
        return web3Auth.provider;
      } else {
        const _idToken = await firebaseUser.getIdToken(true);
        console.debug('WEB3AUTH: provider not set yet. requesting id token');
        const _provider = await web3Auth
          .connect({
            verifier: 'wallet-firebase',
            verifierId: firebaseUser.uid,
            idToken: _idToken,
          })
          .then(async (_provider) => {
            if (!_provider) {
              console.error('WEB3AUTH: Error getting owner key');
              return;
            }

            const _privKey: string = (await _provider.request({ method: 'eth_private_key' })) ?? '';
            const _ownerSigner = new ethers.Wallet(_privKey);

            console.log('WEB3AUTH: owner signer', _ownerSigner);

            setOwnerWallet(_ownerSigner);
            setOwnerPubKey(_ownerSigner.address);

            return _provider;
          })
          .catch((err) => {
            console.error(err);
          });

        return _provider;
      }
    },
    [web3Auth, firebaseUser, setOwnerPubKey, setOwnerWallet]
  );

  const getOwnerKeysAndNavigate = useCallback(
    async (_web3Auth?: Web3Auth) => {
      const _provider = await getOwnerKeys(_web3Auth);
      if (_provider) {
        navigate('/onboarding/fetchAccounts');
      }
    },
    [getOwnerKeys, navigate]
  );

  const findDeployedAccounts = useCallback(async () => {
    let accounts: string[] = [];
    if (accounts) {
      navigate('/onboarding/select-account');
    } else {
      navigate('/onboarding/select-username');
    }
  }, []);

  const selectUsername = useCallback(async (_username: string) => {
    setAccountUsername(_username);
  }, []);

  const handlePinSubmit = useCallback(
    async (pin: string) => {
      if (!accountUsername) {
        console.debug('CONTEXT: username not set');
        return;
      }
      if (!ownerWallet) {
        console.debug('CONTEXT: No owner signer. Can not register key');
        return;
      }
      if (!firebaseUser) {
        console.debug('CONTEXT: Firebase user not initialized yet');
        return;
      }

      try {
        const regDevice = await initDeviceWithPin({
          pin: pin,
          accountUsername: accountUsername,
          ownerSigner: ownerWallet,
        });

        console.log('regDevice res', regDevice);
      } catch (err) {
        console.error(err);
      }

      // ask keyring to deploy account with username, registering the device key
      // const tx = await keyring.registerKey(accountUsername, ownerPubKey);
    },
    [accountUsername, ownerWallet, firebaseUser, initDeviceWithPin]
  );

  // deployAccount

  return (
    <OnboardingContext.Provider
      value={{
        step: 0,
        mode: OnboardingMode.NONE,
        web3Auth,
        canResendOTP,
        firebaseUser,
        ownerPubKey,
        setStep: (step: number) => {},
        setMode: (mode: OnboardingStep) => {},
        handlePhoneSubmit,
        handleVerifyOTP,
        getOwnerKeysAndNavigate,
        selectUsername,
        handlePinSubmit,
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

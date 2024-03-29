import { Web3Auth } from '@web3auth/single-factor-auth';
import { ethers, Wallet } from 'ethers';
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, User } from 'firebase/auth';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chainConfig, SUBGRAPH_URL, web3AuthClientId } from '../utils/constants';
import { auth } from '../utils/firebase';
import { useKeyringContext } from './KeyringContext';

const HUMANACCOUNT_BY_OWNER_QUERY = `
query HumanAccounts($where: HumanAccount_filter) {
  humanAccounts(where: $where) {
    address
    owner
    username
  }
}`;
interface DeployedAccount {
  address: string;
  owner: string;
  username: string;
}

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

interface OnboardingContextInterface {
  step: number;
  mode: OnboardingMode;
  canResendOTP: boolean;
  firebaseUser: User | null;
  web3Auth: Web3Auth | undefined;
  ownerPubKey: string;
  deployedAccounts: DeployedAccount[];
  phoneNumber: string;
  setStep: (step: number) => void;
  setMode: (mode: OnboardingStep) => void;
  handlePhoneSubmit: (phoneNumber: string) => Promise<boolean>;
  handleResendOTP: () => Promise<void>;
  handleVerifyOTP: (otp: string) => Promise<boolean>;
  getOwnerKeysAndNavigate: (web3Auth?: Web3Auth) => Promise<void>;
  selectUsername: (username: string) => Promise<void>;
  handlePinSubmit: (pin: string) => Promise<void>;
  findDeployedAccounts: () => Promise<DeployedAccount[]>;
}

export const OnboardingContext = createContext<OnboardingContextInterface>({
  step: 0,
  mode: OnboardingMode.NONE,
  canResendOTP: false,
  firebaseUser: null,
  phoneNumber: '',
  web3Auth: undefined,
  ownerPubKey: '',
  deployedAccounts: [],

  setStep: (step: number) => {},
  setMode: (mode: OnboardingStep) => {},

  handlePhoneSubmit: (phoneNumber: string) => Promise.resolve(false),
  handleResendOTP: () => Promise.resolve(),
  handleVerifyOTP: (otp: string) => Promise.resolve(false),
  getOwnerKeysAndNavigate: (web3Auth?: Web3Auth) => Promise.resolve(),
  selectUsername: (username: string) => Promise.resolve(),
  handlePinSubmit: (pin: string) => Promise.resolve(),
  findDeployedAccounts: () => Promise.resolve([]),
});

export const OnboardingContextProvider = ({ children }: { children: React.ReactNode }) => {
  // const [step, setStep] = useState<OnboardingStep>(OnboardingStep.PHONE_INPUT);
  // const [mode, setMode] = useState<OnboardingMode>(OnboardingMode.NONE);

  const [firebaseUser, setFirebaseUser] = useState<User>(auth.currentUser as User);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [applicationVerifier, setApplicationVerifier] = useState<RecaptchaVerifier | null>(null);

  const [web3Auth, setWeb3Auth] = useState<Web3Auth | undefined>();
  const [ownerWallet, setOwnerWallet] = useState<Wallet>();
  const [ownerPubKey, setOwnerPubKey] = useState<string>('');

  const [deployedAccounts, setDeployedAccounts] = useState<DeployedAccount[]>([]);

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
      usePnPKey: false, // Setting this to true returns the same key as PnP Web SDK, By default, this SDK returns CoreKitKey.
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
        setPhoneNumber(user.phoneNumber as string);
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
  }, []);

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
        setPhoneNumber(phoneNumber);
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
      navigate('/onboarding/phone-verify', {
        replace: true,
      });

      return true;
    },
    [_requestOTP, navigate]
  );

  const handleVerifyOTP = useCallback(
    async (verificationCode: string) => {
      if (!confirmationResult || !verificationCode) {
        console.log('confirmationResult not initialized yet or verification code not entered');
        return false;
      }
      try {
        const loginRes = await confirmationResult.confirm(verificationCode);
        setFirebaseUser(loginRes.user);

        return true;
      } catch (err) {
        console.debug(err);
      }

      return false;
    },
    [confirmationResult]
  );

  const handleResendOTP = useCallback(async () => {
    if (!phoneNumber) {
      console.debug('CONTEXT: phone number not set yet');
      return;
    }
    await _requestOTP(phoneNumber);
  }, [_requestOTP, phoneNumber]);

  const getOwnerKeys = useCallback(async () => {
    if (!web3Auth) {
      console.error('WEB3AUTH: web3auth not initialized yet');
      throw new Error('WEB3AUTH: web3auth not initialized yet');
    }

    if (!firebaseUser) {
      console.error('FIREBASE: firebase user not initialized yet');
      throw new Error('FIREBASE: firebase user not initialized yet');
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
            throw new Error('WEB3AUTH: Error getting owner key');
          }

          const _privKey: string = (await _provider.request({ method: 'eth_private_key' })) ?? '';
          const _ownerSigner = new ethers.Wallet(_privKey);

          setOwnerWallet(_ownerSigner);
          setOwnerPubKey(_ownerSigner.address);

          return _provider;
        })
        .catch((err) => {
          console.error('WEB3AUTH: Connection failed', err);
        });

      return _provider;
    }
  }, [web3Auth, firebaseUser, setOwnerPubKey, setOwnerWallet]);

  const getOwnerKeysAndNavigate = useCallback(async () => {
    const _provider = await getOwnerKeys();
    if (_provider) {
      navigate('/onboarding/fetchAccounts', {
        replace: true,
      });
    }
  }, [getOwnerKeys, navigate]);

  const findDeployedAccounts = useCallback(async () => {
    let accounts: DeployedAccount[] = [];
    // const myHeaders = new Headers();
    // myHeaders.append('Content-Type', 'application/json');

    const graphql = JSON.stringify({
      query: HUMANACCOUNT_BY_OWNER_QUERY,
      variables: { where: { owner: ownerPubKey } },
    });
    const requestOptions = {
      method: 'POST',
      body: graphql,
    };

    const res = await fetch(SUBGRAPH_URL, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    if (res?.data?.humanAccounts) {
      accounts = res.data.humanAccounts;
    }
    setDeployedAccounts(accounts as DeployedAccount[]);
    return accounts;
  }, [ownerPubKey]);

  const selectUsername = useCallback(
    async (_username: string) => {
      setAccountUsername(_username);
      navigate('/onboarding/select-pin', {
        replace: true,
      });
    },
    [navigate]
  );

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

      // try {
      const regDevice = await initDeviceWithPin({
        pin: pin,
        accountUsername: accountUsername,
        ownerSigner: ownerWallet,
      });

      if (!regDevice) {
        console.error('Error initializing device');
        return;
      }

      navigate('/onboarding/final', {
        replace: true,
      });
      // } catch (err) {
      //   console.error(err);
      // }
    },
    [accountUsername, ownerWallet, firebaseUser, initDeviceWithPin, navigate]
  );

  // deployAccount

  return (
    <OnboardingContext.Provider
      value={{
        step: 0,
        mode: OnboardingMode.NONE,
        phoneNumber,
        web3Auth,
        canResendOTP,
        firebaseUser,
        ownerPubKey,
        deployedAccounts,
        setStep: (step: number) => {},
        setMode: (mode: OnboardingStep) => {},
        handlePhoneSubmit,
        handleResendOTP,
        handleVerifyOTP,
        getOwnerKeysAndNavigate,
        selectUsername,
        handlePinSubmit,
        findDeployedAccounts,
      }}>
      {children}
      <div
        id="recaptcha-container"
        className="hidden"
        ref={recaptchaContainer}></div>
    </OnboardingContext.Provider>
  );
};

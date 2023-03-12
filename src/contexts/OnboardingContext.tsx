import { createContext, useState } from 'react';
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

// onboarding -> phone -> username -> pin -> created
// onboarding -> phone -> login -> pin -> loaded

const OnboardingContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<OnboardingMode>(OnboardingMode.NONE);

  // handlePhoneSubmit
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

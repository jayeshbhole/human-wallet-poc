import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OnboardingActionButton, OnboardingStepHeading } from '../../../components/Onboarding';
import OTPInput from '../../../components/OTPInput';
import PhoneInput from '../../../components/PhoneInput';
import { OnboardingContext, OnboardingStep } from '../../../contexts/OnboardingContext';
// import './phone-login.css';

const PhoneLogin = () => {
  const { firebaseUser, handlePhoneSubmit, handleVerifyOTP } = useContext(OnboardingContext);

  const [phoneNumber, setPhoneNumber] = useState(firebaseUser?.phoneNumber || '');
  const [otp, setOTP] = useState('');

  const { step } = useParams();

  const handleAction = () => {
    if (step === OnboardingStep.PHONE_INPUT) {
      handlePhoneSubmit(phoneNumber);
    } else if (step === OnboardingStep.PHONE_VERIFY) {
      handleVerifyOTP(otp);
    }
  };

  useEffect(() => {
    if (firebaseUser?.phoneNumber) {
      setPhoneNumber(firebaseUser?.phoneNumber || '');
    }
  }, [firebaseUser]);

  return (
    <>
      <OnboardingStepHeading
        step={step}
        phoneNumber={phoneNumber}
      />

      {step === OnboardingStep.PHONE_INPUT ? (
        <PhoneInput
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      ) : step === OnboardingStep.PHONE_VERIFY ? (
        <OTPInput
          value={otp}
          setOTP={setOTP}
        />
      ) : (
        <>Wrong Route</>
      )}

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>
        {step === OnboardingStep.PHONE_INPUT ? 'Continue' : 'Verify'}
      </OnboardingActionButton>
    </>
  );
};

export default PhoneLogin;

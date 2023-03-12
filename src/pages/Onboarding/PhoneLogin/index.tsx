import { useParams } from 'react-router-dom';
import PhoneInput from '../../../components/PhoneInput';
import './phone-login.css';
import { useContext, useEffect, useState } from 'react';
import { OnboardingContext, OnboardingStep } from '../../../contexts/OnboardingContext';
import OTPInput from '../../../components/OTPInput';

const Heading = ({ step, phoneNumber }: { step: string | undefined; phoneNumber: string }) => {
  if (step === OnboardingStep.PHONE_INPUT) {
    return (
      <div className="flex gap-3 flex-col">
        {/* step title */}
        <h1 className="__step-heading">
          What's your <br />
          <span className="emphasis">Phone Number?</span>
        </h1>
        {/* step description */}
        <p className="__step-description">Enter the phone number for your account.</p>
      </div>
    );
  } else if (step === OnboardingStep.PHONE_VERIFY) {
    return (
      <div className="flex gap-3 flex-col">
        {/* step title */}
        <h1 className="__step-heading">
          <span className="emphasis">Verify</span> it is you
        </h1>
        {/* step description */}
        <p className="__step-description">Enter the OTP sent to {phoneNumber}</p>
      </div>
    );
  }
  return <>Wrong Step</>;
};

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
      <Heading
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
      <button
        className="__action-button"
        onClick={handleAction}>
        {step === OnboardingStep.PHONE_INPUT ? 'Continue' : 'Verify'}
      </button>
    </>
  );
};

export default PhoneLogin;

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingActionButton } from '../../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../../components/Onboarding/headings';
import OTPInput from '../../../components/OTPInput';
import { OnboardingContext } from '../../../contexts/OnboardingContext';

const PhoneLoginVerify = () => {
  const { handleVerifyOTP, firebaseUser } = useContext(OnboardingContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(firebaseUser?.phoneNumber || '');
  const [otp, setOTP] = useState('');

  useEffect(() => {
    if (firebaseUser?.phoneNumber) {
      setPhoneNumber(firebaseUser?.phoneNumber || '');
    }
  }, [firebaseUser]);

  const handleAction = async () => {
    const res = await handleVerifyOTP(otp);

    if (res) {
      navigate('/onboarding/web3Auth', {
        replace: true,
      });
    }
  };

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            <HeadingEmphasis>Verify</HeadingEmphasis> it is you
          </>
        </StepTitle>
        <StepDescription>Enter the OTP sent to {phoneNumber}</StepDescription>
      </HeadingBox>
      <OTPInput
        value={otp}
        setOTP={setOTP}
      />
      {/* Action Button */}
      <OnboardingActionButton
        isLoading={false}
        disabled={otp.length < 6}
        onClick={handleAction}>
        Continue
      </OnboardingActionButton>
    </>
  );
};

export default PhoneLoginVerify;

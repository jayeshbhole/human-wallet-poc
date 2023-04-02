import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingActionButton } from '../../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../../components/Onboarding/headings';
import PhoneInput from '../../../components/PhoneInput';
import { OnboardingContext } from '../../../contexts/OnboardingContext';

const PhoneLoginInput = () => {
  const { firebaseUser, handlePhoneSubmit } = useContext(OnboardingContext);
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState(firebaseUser?.phoneNumber || '');

  const handleAction = () => {
    handlePhoneSubmit(phoneNumber);
  };

  useEffect(() => {
    if (firebaseUser?.phoneNumber) {
      setPhoneNumber(firebaseUser?.phoneNumber || '');
      navigate('/onboarding/web3Auth', {
        replace: true,
      });
    }
  }, [firebaseUser]);

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            What's your <br />
            <HeadingEmphasis>Phone Number?</HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>Enter the phone number for your account.</StepDescription>
      </HeadingBox>

      <PhoneInput
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

      {/* Action Button */}
      <OnboardingActionButton onClick={handleAction}>Continue</OnboardingActionButton>
    </>
  );
};

export default PhoneLoginInput;

import { useContext, useMemo, useState } from 'react';
import { OnboardingActionButton } from '../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import PinInput from '../../components/PINInput';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const SelectDevicePin = () => {
  const [pinValue, setPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handlePinSubmit } = useContext(OnboardingContext);

  const errorMessage = useMemo(() => {
    if (confirmPin) {
      if (confirmPinValue && pinValue !== confirmPinValue) {
        return 'PINs do not match';
      }
    } else {
      if (pinValue && pinValue.length < 6) {
        return 'PIN must be 6 digits';
      }
    }
    return '';
  }, [pinValue, confirmPinValue, confirmPin]);

  const handleAction = async () => {
    if (confirmPin) {
      if (pinValue === confirmPinValue) {
        try {
          setLoading(true);

          await handlePinSubmit(pinValue);
        } catch (e) {
          console.log(e);
          setLoading(false);
        }
      }
    } else {
      if (pinValue.length === 6) {
        setConfirmPin(true);
      }
    }
  };

  return (
    <>
      <HeadingBox>
        <StepTitle>
          {confirmPin ? (
            <>
              Confirm <br />
              <HeadingEmphasis>Device PIN</HeadingEmphasis>
            </>
          ) : (
            <>
              Create a <br />
              <HeadingEmphasis>Device PIN</HeadingEmphasis>
            </>
          )}
        </StepTitle>
        {confirmPin ? (
          <StepDescription>Confirm the device PIN.</StepDescription>
        ) : (
          <StepDescription>Create a PIN to secure your wallet on this device.</StepDescription>
        )}
      </HeadingBox>

      {/* PIN Input */}
      <PinInput
        pinValue={confirmPin ? confirmPinValue : pinValue}
        setPinValue={confirmPin ? setConfirmPinValue : setPinValue}
        error={errorMessage}
      />

      {/* Action Button */}
      <OnboardingActionButton
        isLoading={loading}
        onClick={handleAction}>
        {loading ? 'Registering Device' : confirmPin ? 'Confirm' : 'Continue'}
      </OnboardingActionButton>
    </>
  );
};

export default SelectDevicePin;

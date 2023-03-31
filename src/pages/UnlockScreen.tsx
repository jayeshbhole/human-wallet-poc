import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { OnboardingActionButton } from '../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../components/Onboarding/headings';
import PinInput from '../components/PINInput';
import { useKeyringContext } from '../contexts/KeyringContext';

const UnlockScreen = () => {
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState<string>();

  const { unlockVault } = useKeyringContext();

  const handlePINSubmit = async (pin: string) => {
    try {
      await unlockVault(pin);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <Box
      px={6}
      pt={6}
      pb={4}
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      gap={8}>
      <HeadingBox>
        <StepTitle>
          <>
            <HeadingEmphasis>
              Unlock Your <br />
              Wallet
            </HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>Enter your device PIN</StepDescription>
      </HeadingBox>

      <PinInput
        pinValue={pinValue}
        setPinValue={setPinValue}
        error={error ?? ''}
      />

      <OnboardingActionButton onClick={() => handlePINSubmit(pinValue)}>Unlock</OnboardingActionButton>
    </Box>
  );
};

export default UnlockScreen;

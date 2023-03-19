import { Box, Heading, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { OnboardingStep } from '../../contexts/OnboardingContext';

const HeadingEmphasis = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      as="span"
      color="text.primary">
      {children}
    </Text>
  );
};

const StepTitle = ({ children }: { children: ReactNode }) => {
  return (
    <Heading
      className="__step-heading"
      fontWeight="600"
      fontSize="2xl"
      color="blackAlpha.500">
      {children}
    </Heading>
  );
};

const StepDescription = ({ children }: { children: ReactNode }) => {
  return <Text color="blackAlpha.600">{children}</Text>;
};

export const OnboardingStepHeading = ({ step, phoneNumber }: { step: string | undefined; phoneNumber: string }) => {
  if (step === OnboardingStep.PHONE_INPUT) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={3}>
        {/* step title */}
        <StepTitle>
          <>
            What's your <br />
            <HeadingEmphasis>Phone Number?</HeadingEmphasis>
          </>
        </StepTitle>
        {/* step description */}
        <StepDescription>Enter the phone number for your account.</StepDescription>
      </Box>
    );
  } else if (step === OnboardingStep.PHONE_VERIFY) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap={3}>
        {/* step title */}
        <StepTitle>
          <>
            <HeadingEmphasis>Verify</HeadingEmphasis> it is you
          </>
        </StepTitle>
        {/* step description */}
        <StepDescription>Enter the OTP sent to {phoneNumber}</StepDescription>
      </Box>
    );
  }
  return <>Wrong Step</>;
};

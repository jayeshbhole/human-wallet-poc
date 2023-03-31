import { Box, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { OnboardingActionButton } from '../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../components/Onboarding/headings';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box h="25%">
        <Image
          src="/world.png"
          alt="world"
          pos="absolute"
          top="0"
          left="0"
          w="full"
          borderRadius="2xl"
        />
      </Box>
      <Box mt="auto">
        <HeadingBox>
          <StepTitle>
            <>
              Welcome to <br />
              <HeadingEmphasis>One Wallet</HeadingEmphasis>
            </>
          </StepTitle>
          <StepDescription>One Wallet for all crypto needs.</StepDescription>
        </HeadingBox>
      </Box>

      <OnboardingActionButton onClick={() => navigate('/onboarding/phone-input')}>Get Started</OnboardingActionButton>
    </>
  );
};

export default Landing;

import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { OnboardingActionButton } from '../../../components/Onboarding';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../../components/Onboarding/headings';
import { useKeyringContext } from '../../../contexts/KeyringContext';

const FinishOnboarding = () => {
  const { activeAccount } = useKeyringContext();
  const navigate = useNavigate();

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            Congratulations! You've <br />
            <HeadingEmphasis>logged into you account</HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>Share your account address and username to start receiving payments!</StepDescription>
      </HeadingBox>

      <Box
        key={activeAccount?.username}
        p={4}
        border="2px solid"
        borderColor="gray.600"
        borderRadius="2xl"
        mb={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'calc(100% - 8px)',
          height: 'calc(100% - 8px)',
          background: 'gray.100',
          borderRadius: 'xl',
          transform: 'translate(-50%, -50%)',
        }}>
        <Box
          zIndex="1"
          mb="2"
          fontSize="xl"
          fontWeight="600"
          color="text.primary">
          {activeAccount?.username}
          <Text
            as="span"
            textColor="gray.400">
            @one
          </Text>
        </Box>
        <Box
          zIndex="1"
          fontSize="xs"
          fontWeight="500"
          color="gray.400"
          // w="15ch"
          // whiteSpace="nowrap"
          // overflow="hidden"
          // textOverflow="ellipsis">
        >
          {activeAccount?.accountAddress}
        </Box>
      </Box>

      <OnboardingActionButton onClick={() => navigate('/wallet')}>Open Wallet</OnboardingActionButton>
    </>
  );
};

export default FinishOnboarding;

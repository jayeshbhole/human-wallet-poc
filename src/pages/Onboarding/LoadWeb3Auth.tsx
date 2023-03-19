import { useContext, useEffect } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

const LoadWeb3Auth = () => {
  const { setWeb3AuthProviderAndNavigate, provider } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!provider) {
      setWeb3AuthProviderAndNavigate();
    } else {
      navigate('/onboarding/fetchAccounts');
    }
  }, [provider, setWeb3AuthProviderAndNavigate, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={8}
      height="100%">
      Loading
      <Button
        onClick={setWeb3AuthProviderAndNavigate}
        backgroundColor="blue.500"
        color="white"
        px={4}
        py={2}
        rounded="md"
        mt="auto">
        Click here if you are stuck
      </Button>
    </Box>
  );
};

export default LoadWeb3Auth;

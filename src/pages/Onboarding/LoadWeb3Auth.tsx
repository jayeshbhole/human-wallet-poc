import { useContext, useEffect } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@chakra-ui/react';

const LoadWeb3Auth = () => {
  const { getOwnerKeysAndNavigate, ownerPubKey, web3Auth } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('web3Auth', web3Auth);
    if (web3Auth) {
      if (!ownerPubKey) {
        getOwnerKeysAndNavigate(web3Auth);
      } else {
        navigate('/onboarding/fetchAccounts');
      }
    }
  }, [getOwnerKeysAndNavigate, web3Auth, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={8}
      height="100%">
      Loading. Getting your owner key
      <Button
        onClick={() => web3Auth && getOwnerKeysAndNavigate(web3Auth)}
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

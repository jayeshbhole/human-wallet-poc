import { Box, Spinner } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyringContext } from '../contexts/KeyringContext';
import { OnboardingContext } from '../contexts/OnboardingContext';

const LoadingSplashScreen = () => {
  const { vault } = useKeyringContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (vault) {
      navigate('/wallet', {
        replace: true,
      });
    } else {
      navigate('/onboarding', {
        replace: true,
      });
    }
  }, [vault, navigate]);

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      justifyContent="space-between">
      <Spinner
        size="xl"
        speed="0.75s"
        thickness="3px"
        m="auto"
      />
    </Box>
  );
};

export default LoadingSplashScreen;

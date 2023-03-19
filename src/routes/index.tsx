import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const LoadingSplashScreen = () => {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      justifyContent="space-between">
      LoadingSplashScreen
      <Button
        onClick={() => setLoading(false)}
        backgroundColor={'#8BEBB2'}>
        Set loading false
      </Button>
    </Box>
  ) : (
    <Navigate to="onboarding" />
  );
};

export default LoadingSplashScreen;

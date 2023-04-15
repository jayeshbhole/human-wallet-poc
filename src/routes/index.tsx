import { Box, Image, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyringContext } from '../contexts/KeyringContext';

const LoadingSplashScreen = () => {
  const { vault } = useKeyringContext();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (vault) {
        navigate('/wallet', {
          replace: true,
        });
      } else {
        navigate('/onboarding', {
          replace: true,
        });
      }
    }, 2500);
  }, [vault, navigate]);

  return (
    <Box
      display="flex"
      height="100%"
      flexDirection="column"
      justifyContent="space-between">
      <Image
        src="/logo512.png"
        alt="logo"
        width={200}
        height={200}
        m="auto"
      />
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

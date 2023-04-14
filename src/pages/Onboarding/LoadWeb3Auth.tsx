import { Box, Spinner } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const LoadWeb3Auth = () => {
  const { getOwnerKeysAndNavigate, ownerPubKey, web3Auth, firebaseUser } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (web3Auth) {
      timeout = setTimeout(() => {
        if (!firebaseUser) {
          navigate('/onboarding', {
            replace: true,
          });
        }
        if (!ownerPubKey) {
          getOwnerKeysAndNavigate(web3Auth);
        } else {
          navigate('/onboarding/fetchAccounts', {
            replace: true,
          });
        }
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [web3Auth, firebaseUser, ownerPubKey, getOwnerKeysAndNavigate, navigate]);

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            Loading <br />
            <HeadingEmphasis>Important Stuff</HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>This screen should disappear soon!</StepDescription>
      </HeadingBox>

      <Spinner
        size="xl"
        speed="0.75s"
        thickness="3px"
        m="auto"
      />
    </>
  );
};

export default LoadWeb3Auth;

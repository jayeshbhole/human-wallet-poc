import { Box, Spinner } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const LoadWeb3Auth = () => {
  const { getOwnerKeysAndNavigate, ownerPubKey, web3Auth, firebaseUser } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (web3Auth) {
      setTimeout(() => {
        if (!firebaseUser) {
          navigate('/onboarding');
        }
        if (!ownerPubKey) {
          getOwnerKeysAndNavigate(web3Auth);
        } else {
          navigate('/onboarding/fetchAccounts');
        }
      }, 1000);
    }
  }, [getOwnerKeysAndNavigate, web3Auth, navigate]);

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

import { Spinner } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeadingBox, HeadingEmphasis, StepDescription, StepTitle } from '../../components/Onboarding/headings';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const FetchAccounts = () => {
  const { ownerPubKey, findDeployedAccounts } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    (async () => {
      if (ownerPubKey) {
        const accounts = await findDeployedAccounts();

        timeout = setTimeout(async () => {
          if (accounts.length) {
            navigate('/onboarding/select-account', {
              replace: true,
            });
          } else {
            navigate('/onboarding/select-username', {
              replace: true,
            });
          }
        }, 2000);
      } else {
        navigate('/onboarding/web3auth', {
          replace: true,
        });
      }
    })();
    return () => timeout && clearTimeout(timeout);
  }, [ownerPubKey, navigate]);

  return (
    <>
      <HeadingBox>
        <StepTitle>
          <>
            Finding <br />
            <HeadingEmphasis>Existing Accounts</HeadingEmphasis>
          </>
        </StepTitle>
        <StepDescription>Checking if you have existing accounts. Give us a sec</StepDescription>
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

export default FetchAccounts;

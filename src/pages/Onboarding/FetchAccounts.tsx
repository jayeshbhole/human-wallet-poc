import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingContext } from '../../contexts/OnboardingContext';

const FetchAccounts = () => {
  const { provider, ownerPubKey } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!provider) {
      //   navigate('/onboarding/web3auth');
    }
  }, [provider, navigate]);

  return <div>Fetching Accounts linked to Owner Key {ownerPubKey}</div>;
};

export default FetchAccounts;
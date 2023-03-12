import React, { useContext, useEffect } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';

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

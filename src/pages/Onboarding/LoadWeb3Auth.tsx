import { useContext, useEffect } from 'react';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col gap-8 h-full">
      Loading
      <button
        onClick={setWeb3AuthProviderAndNavigate}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-auto">
        Click here if you are stuck
      </button>
    </div>
  );
};

export default LoadWeb3Auth;

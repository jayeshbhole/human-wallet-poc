import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const LoadingSplashScreen = () => {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <div>
      LoadingSplashScreen <br />
      <button
        className="button bg-[#8BEBB2]"
        onClick={() => setLoading(false)}>
        Set loading false
      </button>
    </div>
  ) : (
    <Navigate to="onboarding" />
  );
};

export default LoadingSplashScreen;

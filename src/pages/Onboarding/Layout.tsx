import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { Outlet } from 'react-router-dom';
import '../styles/onboarding.css';

const OnboardingLayout = () => {
  return (
    <div className="onboarding">
      <div className="__header">
        {/* back button */}
        <button className="__back-button">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* onboarding flow title */}
        <h3></h3>

        {/* step progress */}
        <div></div>
      </div>

      {/* step */}
      <Outlet />
    </div>
  );
};

export default OnboardingLayout;

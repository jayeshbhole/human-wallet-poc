import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error';
import Landing from './pages/Landing';
import PhoneLogin from './pages/Onboarding/PhoneLogin';
import LoadingSplashScreen from './routes';
import OnboardingLayout from './routes/Onboarding';
import './styles/index.css';
import OnboardingContextProvider from './contexts/OnboardingContext';
import FinishOnboarding from './pages/Onboarding/FinishOnboarding';
import SelectPin from './pages/Onboarding/SelectPin';
import SelectUsername from './pages/Onboarding/SelectUsername';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoadingSplashScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/onboarding',
    element: (
      <OnboardingContextProvider>
        <OnboardingLayout />
      </OnboardingContextProvider>
    ),

    children: [
      { path: '', element: <Landing />, index: true },
      { path: 'phone/:step', element: <PhoneLogin /> },
      { path: 'select-username', element: <SelectUsername /> },
      { path: 'select-pin', element: <SelectPin /> },
      { path: 'final', element: <FinishOnboarding /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="app shadow-2xl shadow-black/40 bg-primaryBg text-primaryText">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);

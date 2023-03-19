import { Box, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import OnboardingContextProvider from './contexts/OnboardingContext';
import ErrorPage from './pages/Error';
import Landing from './pages/Landing';
import FetchAccounts from './pages/Onboarding/FetchAccounts';
import FinishOnboarding from './pages/Onboarding/FinishOnboarding';
import OnboardingLayout from './pages/Onboarding/Layout';
import RecoverWeb3Auth from './pages/Onboarding/LoadWeb3Auth';
import PhoneLogin from './pages/Onboarding/PhoneLogin';
import SelectPin from './pages/Onboarding/SelectPin';
import SelectUsername from './pages/Onboarding/SelectUsername';
import LoadingSplashScreen from './routes';
import './styles/index.css';
import { theme } from './theme';

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
      { path: 'web3Auth', element: <RecoverWeb3Auth /> },
      { path: 'fetchAccounts', element: <FetchAccounts /> },
      { path: 'select-username', element: <SelectUsername /> },
      { path: 'select-pin', element: <SelectPin /> },
      { path: 'final', element: <FinishOnboarding /> },
      // google-login
      // select-account
      // final
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Box
        className="app"
        shadow={'2xl'}
        bg="bg.primary">
        <RouterProvider router={router} />
      </Box>
    </ChakraProvider>
  </React.StrictMode>
);

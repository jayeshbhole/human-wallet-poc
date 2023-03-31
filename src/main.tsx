import { Box, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { KeyringContextProvider } from './contexts/KeyringContext';
import OnboardingContextProvider from './contexts/OnboardingContext';
import ErrorPage from './pages/Error';
import Landing from './pages/Landing';
import FetchAccounts from './pages/Onboarding/FetchAccounts';
import FinishOnboarding from './pages/Onboarding/FinishOnboarding';
import OnboardingLayout from './pages/Onboarding/Layout';
import RecoverWeb3Auth from './pages/Onboarding/LoadWeb3Auth';
import PhoneLoginInput from './pages/Onboarding/PhoneLogin/Input';
import PhoneLoginVerify from './pages/Onboarding/PhoneLogin/Verify';
import SelectAccount from './pages/Onboarding/SelectAccount';
import SelectPin from './pages/Onboarding/SelectPin';
import SelectUsername from './pages/Onboarding/SelectUsername';
import UnlockScreen from './pages/UnlockScreen';
import History from './pages/Wallet/History';
import Home from './pages/Wallet/Home';
import Receive from './pages/Wallet/Receive';
import Send from './pages/Wallet/Send';
import Settings from './pages/Wallet/Settings';
import LoadingSplashScreen from './routes';
import RequireUnlock from './routes/RequirePIN';
import { theme } from './theme';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoadingSplashScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/unlock',
    element: <UnlockScreen />,
  },
  {
    path: '/wallet',
    element: (
      <RequireUnlock>
        <Outlet />
      </RequireUnlock>
    ),
    children: [
      { path: '', element: <Navigate to="/wallet/home" /> },
      { path: 'home', element: <Home />, index: true },
      { path: 'send', element: <Send /> },
      { path: 'receive', element: <Receive /> },
      { path: 'settings', element: <Settings /> },
      { path: 'history', element: <History /> },
    ],
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
      { path: 'phone-input', element: <PhoneLoginInput /> },
      { path: 'phone-verify', element: <PhoneLoginVerify /> },
      { path: 'web3Auth', element: <RecoverWeb3Auth /> },
      { path: 'fetchAccounts', element: <FetchAccounts /> },
      { path: 'select-username', element: <SelectUsername /> },
      { path: 'select-pin', element: <SelectPin /> },
      { path: 'select-account', element: <SelectAccount /> },
      {
        path: 'final',
        element: (
          <RequireUnlock>
            <FinishOnboarding />
          </RequireUnlock>
        ),
      },
      // google-login
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <KeyringContextProvider>
      <ChakraProvider theme={theme}>
        <Box
          className="root-container"
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="full"
          w="full"
          p={{ base: 0, md: 8 }}>
          <Box
            className="app"
            shadow={'2xl'}
            position="relative"
            bg="bg.primary">
            <RouterProvider router={router} />
          </Box>
        </Box>
      </ChakraProvider>
    </KeyringContextProvider>
  </React.StrictMode>
);

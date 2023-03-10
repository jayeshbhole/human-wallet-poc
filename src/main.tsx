import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error';
import Landing from './pages/Landing';
import PhoneLogin from './pages/PhoneLogin';
import LoadingSplashScreen from './routes';
import OnboardingLayout from './routes/Onboarding';
import './styles/index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoadingSplashScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingLayout />,
    children: [
      { path: '', element: <Landing /> },
      { path: 'phone', element: <PhoneLogin /> },
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

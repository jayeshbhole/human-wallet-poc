import { Navigate, useLocation } from 'react-router-dom';
import { useKeyringContext } from '../contexts/KeyringContext';

function RequireUnlock({ children }: { children: JSX.Element }) {
  const { status } = useKeyringContext();
  const location = useLocation();

  if (status === 'locked') {
    return (
      <Navigate
        to="/unlock"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default RequireUnlock;

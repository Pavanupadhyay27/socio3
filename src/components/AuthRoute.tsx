import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { account, userProfile, isConnected } = useWallet();
  const location = useLocation();

  if (!isConnected || !account) {
    // Redirect to login while preserving intended destination
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!userProfile && location.pathname !== '/setup') {
    // Redirect to setup if no profile
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}

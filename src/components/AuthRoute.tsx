import { Navigate, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { account } = useWallet();
  const location = useLocation();
  const storedAccount = localStorage.getItem('lastConnectedAccount');

  if (!account && !storedAccount) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import { useContext } from 'react';
import { WalletContext } from '../../contexts/WalletContext';

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }

  return {
    connect: context.connect,
    disconnect: context.disconnect,
    walletAddress: context.account,
    isConnected: !!context.account,
    isLoading: context.isConnecting,
    error: context.error
  };
}

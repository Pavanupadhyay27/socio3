import { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet } from '../utils/wallet';

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  walletType: string | null;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for existing connection
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        setWalletAddress(savedAddress);
        setWalletType(savedWallet);
        setIsConnected(true);
      }
    }
  }, []);

  const connect = async (walletName: string) => {
    try {
      const address = await connectWallet(walletName);
      setWalletAddress(address);
      setWalletType(walletName);
      setIsConnected(true);
      localStorage.setItem('connectedWallet', walletName);
      localStorage.setItem('walletAddress', address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (walletType) {
        await disconnectWallet(walletType);
      }
      setWalletAddress(null);
      setWalletType(null);
      setIsConnected(false);
      localStorage.removeItem('connectedWallet');
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      isConnected,
      walletType,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

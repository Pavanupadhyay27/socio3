import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(() => {
    // Initialize from localStorage on mount
    const savedAuth = localStorage.getItem('walletAuth');
    if (savedAuth) {
      const { account } = JSON.parse(savedAuth);
      return account;
    }
    return null;
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check connection status periodically
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const checkConnection = async () => {
      if (window.ethereum && account) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (!accounts.includes(account)) {
            handleDisconnect(false); // Disconnect without page reload
          }
        } catch (err) {
          console.error('Connection check failed:', err);
        }
      }
    };

    if (account) {
      // Check connection every 30 seconds
      intervalId = setInterval(checkConnection, 30000);
      // Also check when window regains focus
      window.addEventListener('focus', checkConnection);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener('focus', checkConnection);
    };
  }, [account]);

  const handleDisconnect = useCallback(async (shouldReload = false) => {
    setAccount(null);
    localStorage.removeItem('walletAuth');
    
    if (window.ethereum?.removeAllListeners) {
      window.ethereum.removeAllListeners();
    }

    // Only reload if explicitly requested
    if (shouldReload) {
      window.location.reload();
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!');
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // This triggers the MetaMask popup
      await provider.send("eth_requestAccounts", []);
      
      // Get the signer
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      // Create welcome message
      const message = "Welcome to Web3Social! Click to sign in and accept the terms of service.";
      
      // Request signature (this will trigger another MetaMask popup)
      const signature = await signer.signMessage(message);

      if (!signature) {
        throw new Error('Signature required to sign in');
      }

      setAccount(address);
      
      // Store session
      localStorage.setItem('walletAuth', JSON.stringify({
        account: address,
        signature,
        timestamp: Date.now()
      }));

    } catch (err: any) {
      setAccount(null);
      localStorage.removeItem('walletAuth');
      console.error('Wallet connection error:', err);
      
      if (err.code === 4001) {
        throw new Error('Please connect your wallet to continue');
      } else if (err.code === -32002) {
        throw new Error('Please open MetaMask and accept the connection');
      }
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await handleDisconnect(false); // Don't reload on manual disconnect
  }, [handleDisconnect]);

  const signMessage = useCallback(async (message: string) => {
    if (!account || !window.ethereum) return null;
    
    try {
      const msgParams = `0x${Buffer.from(message).toString('hex')}`;
      return await window.ethereum.request({
        method: 'personal_sign',
        params: [msgParams, account, '']
      });
    } catch (err) {
      console.error('Signing failed:', err);
      return null;
    }
  }, [account]);

  // Handle account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        await handleDisconnect(false);
      } else if (account !== accounts[0]) {
        // If account changed, update it without full reload
        setAccount(accounts[0]);
        const savedAuth = localStorage.getItem('walletAuth');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          localStorage.setItem('walletAuth', JSON.stringify({
            ...authData,
            account: accounts[0],
            timestamp: Date.now()
          }));
        }
      }
    };

    const handleChainChanged = () => {
      // Optionally handle chain changes without reload
      // You might want to update some state here instead
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, handleDisconnect]);

  return (
    <WalletContext.Provider value={{
      account,
      isConnecting,
      error,
      connect,
      disconnect,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

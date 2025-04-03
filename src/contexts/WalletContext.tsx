import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ipfsStorage } from '../services/ipfsStorage';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  userProfile: any;
  profileCID: string | null;
  checkExistingProfile: (address: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [profileCID, setProfileCID] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const resetState = () => {
    setAccount(null);
    setIsConnected(false);
    setUserProfile(null);
    setProfileCID(null);
    localStorage.removeItem('lastConnectedAccount');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('profile_cid_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const checkExistingProfile = async (address: string) => {
    try {
      const savedCID = localStorage.getItem(`profile_cid_${address.toLowerCase()}`);
      if (savedCID) {
        const profile = await ipfsStorage.getProfile(savedCID);
        if (profile) {
          setProfileCID(savedCID);
          setUserProfile(profile);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  const initializeWallet = useCallback(async () => {
    if (!window.ethereum || account) return; // Skip if no provider or already initialized
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' // Use eth_accounts instead of eth_requestAccounts
      });
      
      if (accounts?.[0]) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await checkExistingProfile(accounts[0]);
      }
    } catch (error) {
      console.error('Wallet initialization error:', error);
    }
  }, [account]);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    setIsConnecting(true);

    try {
      // Request accounts with explicit permission request
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [{
          eth_accounts: {}
        }]
      });

      if (accounts?.[0]) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await checkExistingProfile(accounts[0]);
      }
    } catch (error: any) {
      console.error('Connect error:', error);
      resetState();
      if (error.code === 4001) {
        alert('Connection rejected. Please try again.');
      } else {
        alert('Failed to connect. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // First clear all state and storage
      resetState();
      
      // Clear any MetaMask cached connections
      if (window.ethereum) {
        try {
          // Force MetaMask disconnection
          await window.ethereum?.request({
            method: 'eth_requestAccounts',
            params: []
          });

          // Clear permissions
          await window.ethereum?.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch (e) {
          console.log('MetaMask disconnect error:', e);
        }

        // Remove all listeners
        window.ethereum.removeAllListeners?.();
      }

      // Clear all storage
      sessionStorage.clear();
      const theme = localStorage.getItem('theme');
      localStorage.clear();
      if (theme) localStorage.setItem('theme', theme);

      // Reset all state
      setAccount(null);
      setIsConnected(false);
      setUserProfile(null);
      setProfileCID(null);

      // Force reload to clear any remaining state
      window.location.reload();
    } catch (error) {
      console.error('Disconnect error:', error);
      resetState();
      window.location.reload();
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (!accounts || accounts.length === 0) {
      await disconnect();
    } else if (accounts[0] !== account) {
      resetState();
      setAccount(accounts[0]);
      setIsConnected(true);
      const hasProfile = await checkExistingProfile(accounts[0]);
      if (!hasProfile) {
        window.location.replace('/');
      }
    }
  };

  useEffect(() => {
    initializeWallet();
    
    // Setup event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', disconnect);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', disconnect);
      }
    };
  }, [initializeWallet]);

  return (
    <WalletContext.Provider 
      value={{
        account,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        userProfile,
        profileCID,
        checkExistingProfile
      }}
    >
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

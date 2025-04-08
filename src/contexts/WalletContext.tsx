import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ipfsStorage } from '../services/ipfsStorage';
import { getUserProfile } from '../utils/storage';

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

  const resetState = useCallback(() => {
    // Clear only wallet connection state
    setAccount(null);
    setIsConnected(false);
    
    // Remove only wallet-specific data
    localStorage.removeItem('lastConnectedAccount');
    
    // Keep user profile data
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  }, []);

  const checkExistingProfile = async (address: string) => {
    try {
      const localProfile = localStorage.getItem(`userProfile_${address.toLowerCase()}`);
      if (localProfile) {
        const profile = JSON.parse(localProfile);
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking profile:', error);
      return false;
    }
  };

  const loadExistingProfile = useCallback(async () => {
    try {
      if (!account) return null;
      const profile = getUserProfile(account);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error loading existing profile:', error);
      return null;
    }
  }, [account]);

  const initializeWallet = useCallback(() => {
    // Skip auto initialization completely
    return;
  }, []);

  useEffect(() => {
    // Remove auto-connection logic
    // Only clear state if there's no stored account
    if (!localStorage.getItem('lastConnectedAccount')) {
      resetState();
    }
  }, []);

  useEffect(() => {
    // Clear any stored wallet data on initial load
    localStorage.removeItem('lastConnectedAccount');
    resetState();
  }, [resetState]);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const currentAccount = accounts[0];
        setAccount(currentAccount);
        setIsConnected(true);
        
        // Check for existing profile
        const hasProfile = await checkExistingProfile(currentAccount);
        if (hasProfile) {
          setUserProfile(await getUserProfile(currentAccount));
        }
        return hasProfile;
      }
      return false;
    } catch (error) {
      console.error('Connection error:', error);
      resetState();
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }

      // Reset permissions if supported
      if (window.ethereum?.request) {
        try {
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch (error) {
          console.error('Error revoking permissions:', error);
        }
      }

      resetState();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  useEffect(() => {
    // Only set up event listeners, no auto-connection
    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        resetState();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', resetState);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', resetState);
      };
    }
  }, [account, resetState]);

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

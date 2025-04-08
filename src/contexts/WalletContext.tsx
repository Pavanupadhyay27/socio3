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

  const loadExistingProfile = async (address: string) => {
    try {
      const profile = getUserProfile(address);
      if (profile) {
        setUserProfile(profile);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading existing profile:', error);
      return false;
    }
  };

  const initializeWallet = useCallback(() => {
    // Skip auto initialization completely
    return;
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    setIsConnecting(true);

    try {
      // Force MetaMask to show permission prompt
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts?.[0]) {
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem('lastConnectedAccount', accounts[0]);
        
        // Try to load existing profile
        const hasProfile = await loadExistingProfile(accounts[0]);
        if (!hasProfile) {
          await checkExistingProfile(accounts[0]);
        }
      }
    } catch (error: any) {
      console.error('Connect error:', error);
      resetState();
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
    // Try to restore last connected account on mount
    const lastAccount = localStorage.getItem('lastConnectedAccount');
    if (lastAccount && window.ethereum) {
      loadExistingProfile(lastAccount).then(hasProfile => {
        if (hasProfile) {
          setAccount(lastAccount);
          setIsConnected(true);
        }
      });
    }
  }, []);

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

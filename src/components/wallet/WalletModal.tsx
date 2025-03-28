import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './useWallet';
import { WalletInfo } from './types';
import { Loader } from 'lucide-react';

interface WalletModalProps {
  onClose: () => void;
  onConnect?: () => void;
}

async function detectWallets(): Promise<WalletInfo[]> {
  return [
    {
      name: 'MetaMask',
      installed: typeof window !== 'undefined' && !!window.ethereum?.isMetaMask
    }
    // Removed WalletConnect as it needs proper provider setup
  ];
}

export function WalletModal({ onClose, onConnect }: WalletModalProps) {
  const { connect, disconnect, walletAddress, isConnected, walletType, isLoading, error } = useWallet();
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    async function fetchWallets() {
      // Only show wallets that are actually available
      const wallets = await detectWallets();
      setAvailableWallets(wallets.filter(wallet => wallet.installed));
    }
    fetchWallets();
  }, []);

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
      onConnect?.();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onClose();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-2xl p-8 max-w-md w-full mx-4 relative"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Connect Wallet</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error.message}
            </div>
          )}

          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-400">Connected to {walletType}</p>
                <p className="text-white font-mono text-sm mt-1">{walletAddress}</p>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="w-full bg-red-500/20 text-red-200 rounded-lg p-3 hover:bg-red-500/30 disabled:opacity-50"
              >
                {isLoading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => handleConnect(wallet.name)}
                  disabled={isLoading || !wallet.installed}
                  className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 
                    p-4 rounded-lg flex items-center justify-between transition-all duration-200"
                >
                  <span className="text-white">{wallet.name}</span>
                  {isLoading && (
                    <Loader className="w-5 h-5 animate-spin text-purple-500" />
                  )}
                </button>
              ))}
            </div>
          )}
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
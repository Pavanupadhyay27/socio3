import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

export function ConnectWallet() {
  const { connect, disconnect, account, isConnecting } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!account) {
      try {
        await connect();
      } catch (error) {
        console.error('Connection failed:', error);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    await disconnect();
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleConnect}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold
          bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 text-white
          hover:bg-right-center transition-all duration-500 transform hover:shadow-lg 
          hover:shadow-purple-500/25 backdrop-blur-sm border border-white/10"
      >
        {account ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-sm font-medium tracking-wide">{truncateAddress(account)}</span>
            </div>
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5 text-white/90" />
            <span className="font-medium tracking-wide">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {showDropdown && account && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 py-2 bg-black/80 backdrop-blur-xl rounded-lg 
                      border border-purple-500/20 shadow-xl shadow-purple-500/10 z-50"
          >
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-3 text-left text-white hover:bg-purple-500/10
                        transition-colors flex items-center gap-3 group"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
              <span className="font-medium group-hover:text-red-400 transition-colors">Disconnect</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
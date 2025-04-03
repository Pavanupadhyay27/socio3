import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

export function ConnectWallet() {
  const { connect, disconnect, account, isConnecting } = useWallet();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isConnecting || isDisconnecting) return;

    if (account) {
      setIsDisconnecting(true);
      try {
        await disconnect();
      } catch (error) {
        console.error('Disconnect failed:', error);
      } finally {
        setIsDisconnecting(false);
      }
    } else {
      try {
        await connect();
      } catch (error) {
        console.error('Connect failed:', error);
      }
    }
  };

  const buttonText = isDisconnecting ? 'Disconnecting...' : 
                    isConnecting ? 'Connecting...' :
                    account ? `${account.slice(0, 6)}...${account.slice(-4)}` :
                    'Connect Wallet';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleAction}
      disabled={isConnecting || isDisconnecting}
      className={`px-4 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2
        ${account ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                 : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'}`}
    >
      {account ? (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>{buttonText}</span>
          <LogOut className="w-4 h-4 ml-2" />
        </>
      ) : (
        <>
          <Wallet size={20} />
          <span>{buttonText}</span>
        </>
      )}
    </motion.button>
  );
}

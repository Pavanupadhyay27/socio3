import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectWallets, WalletInfo } from '../utils/walletUtils';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: string) => Promise<void>;
  connectedWallet?: string;
  onDisconnect?: () => Promise<void>;
  walletAddress?: string;
}

const WalletIcon = ({ wallet }: { wallet: WalletInfo }) => (
  <motion.div
    className="relative w-12 h-12" // Increased size
    style={{ perspective: '1000px' }}
  >
    <motion.div
      className="absolute inset-0 rounded-2xl" // Increased roundness
      animate={{
        rotateY: [0, 15, -15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        transformStyle: "preserve-3d",
        background: `linear-gradient(135deg, ${wallet.color}30, ${wallet.color})`,
        boxShadow: `
          0 0 20px ${wallet.color}20,
          inset 0 0 30px ${wallet.color}20
        `,
      }}
    >
      <motion.img
        src={wallet.icon}
        alt={wallet.name}
        className="w-full h-full p-2.5 object-contain drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
        }}
      />
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${wallet.color}10, ${wallet.color}40)`,
          mixBlendMode: 'soft-light',
        }}
      />
    </motion.div>
  </motion.div>
);

const WalletModal = ({ isOpen, onClose, onConnect, connectedWallet, onDisconnect, walletAddress }: WalletModalProps) => {
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

  // Update wallet list when modal is opened or wallet connection changes
  useEffect(() => {
    const getWallets = async () => {
      const wallets = await detectWallets();
      setAvailableWallets(wallets.filter(w => w.isInstalled));
    };
    
    if (isOpen) {
      getWallets();
    }
  }, [isOpen, connectedWallet]); // Add connectedWallet as dependency

  const handleWalletClick = async (wallet: WalletInfo) => {
    if (wallet.name === connectedWallet && onDisconnect) {
      await onDisconnect();
      // Refresh wallet list after disconnect
      const wallets = await detectWallets();
      setAvailableWallets(wallets.filter(w => w.isInstalled));
    } else {
      onConnect(wallet.name);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-[4.5rem] right-4 z-50 w-[320px] sm:w-[360px]"
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-purple-900/90 to-black/90 p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Connect Wallet
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white text-sm p-1"
              >
                ✕
              </motion.button>
            </div>
            <motion.div 
              className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2" // Increased gap and height
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {availableWallets.length > 0 ? (
                availableWallets.map((wallet) => (
                  <motion.button
                    key={wallet.name}
                    variants={{
                      hidden: { opacity: 0, y: 20, rotateX: -20 },
                      show: { 
                        opacity: 1, 
                        y: 0,
                        rotateX: 0,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        }
                      }
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      rotateX: 5,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 group
                      transform-gpu preserve-3d
                      ${wallet.isInstalled 
                        ? 'bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10' 
                        : 'bg-white/5 opacity-50 cursor-not-allowed'}
                      ${wallet.name === connectedWallet 
                        ? 'border-2 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                        : 'border border-white/10 hover:border-white/20'}
                    `}
                    style={{
                      boxShadow: wallet.name === connectedWallet 
                        ? `0 0 20px ${wallet.color}30`
                        : '0 8px 20px rgba(0,0,0,0.2)',
                    }}
                    onClick={() => wallet.isInstalled && handleWalletClick(wallet)}
                    disabled={!wallet.isInstalled}
                  >
                    <WalletIcon wallet={wallet} />
                    <div className="ml-3 flex-1 preserve-3d" style={{ transform: 'translateZ(20px)' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-semibold">
                          {wallet.name}
                        </span>
                        {wallet.name === connectedWallet ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-green-400 mb-0.5">
                              Connected
                            </span>
                            <span className="text-xs text-gray-400">
                              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                            </span>
                          </div>
                        ) : (
                          <span className={`text-xs ${
                            wallet.isInstalled ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {wallet.isInstalled ? 'Connect' : 'Not Installed'}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">
                          {wallet.identifier === 'metamask' || wallet.identifier === 'core' 
                            ? 'Popular' 
                            : 'Web3 Wallet'}
                        </span>
                        {wallet.name === connectedWallet && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDisconnect?.();
                            }}
                            className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-0.5 rounded-full"
                          >
                            Disconnect
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, transparent, ${
                          wallet.name === connectedWallet 
                            ? 'rgba(239, 68, 68, 0.1)' 
                            : `${wallet.color}10`
                        })`,
                        transform: 'translateZ(-10px)',
                      }}
                    />
                  </motion.button>
                ))
              ) : (
                <div className="col-span-2 text-center p-4 text-gray-400">
                  No wallets detected. Please install a Web3 wallet.
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ShieldCheck, AlertCircle } from 'lucide-react';

interface WalletIntroModalProps {
  isVisible: boolean;
}

export function WalletIntroModal({ isVisible }: WalletIntroModalProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gradient-to-br from-purple-900/90 to-black/90 p-6 rounded-xl border border-white/10 max-w-md w-full mx-4"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Wallet className="w-12 h-12 text-purple-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white">Connecting to Wallet</h2>
              
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  <p>Please review the connection request in your wallet</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <p>Make sure you're connecting to the correct site</p>
                </div>
              </div>

              <div className="w-full max-w-[200px] h-1 bg-purple-900/50 rounded-full overflow-hidden mt-4">
                <motion.div
                  className="h-full bg-purple-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

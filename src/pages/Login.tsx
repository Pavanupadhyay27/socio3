import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { RegistrationForm } from '../components/RegistrationForm';
import { setUserProfile } from '../utils/storage';
import { ConnectWallet } from '../components/ConnectWallet';

export function Login() {
  const navigate = useNavigate();
  const { account, userProfile, isConnected } = useWallet();
  const location = useLocation();

  useEffect(() => {
    // Clear any existing wallet state on load
    if (!account && !isConnected) {
      localStorage.removeItem('lastConnectedAccount');
    }
    
    // Only redirect if we have both account and profile
    if (account && userProfile) {
      const destination = location.state?.from?.pathname || '/app';
      navigate(destination, { replace: true });
    }
  }, [account, userProfile, isConnected, navigate, location]);

  const handleProfileSubmit = async (data: any) => {
    if (!account) return;
    try {
      await setUserProfile(data, account);
      // Force navigation after profile creation
      navigate('/app', { replace: true });
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-2 gap-8 p-8">
        {/* Left Side - Platform Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="w-16 h-16 bg-purple-500/20 rounded-xl backdrop-blur-sm border border-purple-500/30
                  flex items-center justify-center"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">#</span>
              </motion.div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                hashdit
              </h1>
            </div>
            <p className="text-2xl text-gray-300">
              Connect. Create. Earn. <br/>
              Your decentralized social platform.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          >
            <h2 className="text-xl text-white mb-6">Get started with Web3</h2>
            
            {/* Connect Wallet Button */}
            <ConnectWallet />

            {/* Supported wallets */}
            <div className="flex items-center gap-3 justify-center mt-4 border-t border-white/10 pt-4">
              {["MetaMask", "Coinbase", "Trust"].map((wallet) => (
                <div key={wallet} className="flex items-center gap-1 text-sm text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {wallet}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Registration Form */}
        <div>
          {account && !userProfile ? (
            <RegistrationForm 
              onClose={() => {}} 
              onSubmit={handleProfileSubmit}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-xl text-gray-400">
                {!account ? 'Connect your wallet to continue' : 'Loading...'}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
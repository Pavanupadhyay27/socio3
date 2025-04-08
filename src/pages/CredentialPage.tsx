import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { ConnectWallet } from '../components/ConnectWallet';
import { RegistrationForm } from '../components/RegistrationForm';
import type { RegistrationData } from '../components/RegistrationForm';
import StarBackground from '../components/StarBackground';

export const CredentialPage = () => {
  const navigate = useNavigate();
  const { account, userProfile } = useWallet();

  const handleProfileSubmit = async (data: RegistrationData) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify({ ...data, walletAddress: account }));
      navigate('/posts');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to create profile. Please try again.');
    }
  };

  useEffect(() => {
    if (account && userProfile) {
      navigate('/posts');
    }
  }, [account, userProfile, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-2 bg-black">
      <StarBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 pointer-events-none" />

      <div className="w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-2 gap-6 p-2 relative z-10">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            hashdit
          </h1>
          <p className="text-2xl text-gray-300">
            Connect. Create. Earn.
          </p>
        </div>

        {/* Right Side - Connect Section */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl p-8 rounded-xl border border-white/10"
          >
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 mx-auto text-purple-500 mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Welcome to hashdit
              </h2>
              <p className="text-gray-400 mb-8">
                Connect your wallet to start your journey
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <ConnectWallet />
              
              {account && !userProfile && (
                <div className="scale-90 origin-top">
                  <RegistrationForm onSubmit={handleProfileSubmit} onClose={() => {}} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-pink-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

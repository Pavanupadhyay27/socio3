import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { ConnectWallet } from '../components/ConnectWallet';
import { RegistrationForm } from '../components/RegistrationForm';
import type { RegistrationData } from '../components/RegistrationForm';
import StarBackground from '../components/StarBackground';
import { ipfsStorage } from '../services/ipfsStorage'; // Add this import

export const CredentialPage = () => {
  const navigate = useNavigate();
  const { account, userProfile } = useWallet();
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (account && userProfile) {
      navigate('/posts');
    } else if (account && !userProfile) {
      setShowRegistration(true);
    }
  }, [account, userProfile, navigate]);

  const handleProfileSubmit = async (data: RegistrationData) => {
    try {
      if (!account) {
        throw new Error('No wallet connected');
      }

      // First save to IPFS
      const ipfsCid = await ipfsStorage.saveProfile({
        ...data,
        walletAddress: account,
        createdAt: new Date().toISOString()
      });

      if (!ipfsCid) {
        throw new Error('Failed to upload profile to IPFS');
      }

      // Create complete profile data
      const profileData = {
        ...data,
        walletAddress: account,
        ipfsCid,
        createdAt: new Date().toISOString()
      };

      try {
        // Save to local storage
        localStorage.setItem(`userProfile_${account.toLowerCase()}`, JSON.stringify(profileData));
        localStorage.setItem(`profile_cid_${account.toLowerCase()}`, ipfsCid);
        
        // Dispatch profile updated event
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profileData }));
        
        // Navigate only after successful save
        navigate('/posts');
      } catch (storageError) {
        console.error('Local storage error:', storageError);
        throw new Error('Failed to save profile data locally');
      }
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      alert(error.message || 'Failed to create profile. Please try again.');
    }
  };

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

        {/* Right Side - Connect/Registration Section */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 backdrop-blur-xl p-8 rounded-xl border border-white/10"
          >
            {!account ? (
              <>
                <div className="text-center mb-6">
                  <Shield className="w-12 h-12 mx-auto text-purple-500 mb-4 animate-pulse" />
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Welcome to hashdit
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Connect your wallet to start your journey
                  </p>
                </div>
                <ConnectWallet />
              </>
            ) : showRegistration && !userProfile ? (
              <RegistrationForm onSubmit={handleProfileSubmit} onClose={() => {}} />
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

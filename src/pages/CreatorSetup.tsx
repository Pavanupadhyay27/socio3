import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { RegistrationForm } from '../components/RegistrationForm';
import type { RegistrationData } from '../components/RegistrationForm';
import { setUserProfile } from '../utils/storage';

export function CreatorSetup() {
  const navigate = useNavigate();
  const { account } = useWallet();

  useEffect(() => {
    if (!account) {
      navigate('/', { replace: true });
    }
  }, [account, navigate]);

  const handleSubmit = async (data: RegistrationData) => {
    if (!account) return;

    try {
      await setUserProfile(data, account);
      navigate('/create-post');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 to-black/20">
      <RegistrationForm
        onClose={() => navigate('/')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default CreatorSetup;

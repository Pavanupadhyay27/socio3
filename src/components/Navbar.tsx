import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { getUserProfile } from '../utils/storage';
import { RegistrationForm } from './RegistrationForm';

export function Navbar() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const handleHomeClick = () => {
    navigate('/');
    // Scroll to hero section with smooth behavior
    setTimeout(() => {
      const heroSection = document.getElementById('home');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleCreatePost = () => {
    if (!account) {
      alert('Please connect your wallet to create a post');
      return;
    }

    const userProfile = getUserProfile();
    if (!userProfile) {
      setShowRegistrationForm(true);
      return;
    }

    navigate('/create-post');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
          >
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-xl">Hashdit</span>
          </motion.button>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
                rounded-lg text-white hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              <Plus size={20} />
              <span>Create Post</span>
            </motion.button>
          </div>
        </div>
      </div>

      {showRegistrationForm && (
        <div className="fixed inset-0 z-[999] mt-16">
          <RegistrationForm
            onClose={() => setShowRegistrationForm(false)}
            onSubmit={(data) => {
              localStorage.setItem('userProfile', JSON.stringify({ ...data, walletAddress: account }));
              setShowRegistrationForm(false);
              navigate('/create-post');
            }}
          />
        </div>
      )}
    </header>
  );
}
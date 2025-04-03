import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Settings } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { getUserProfile } from '../utils/storage';
import type { RegistrationData } from './RegistrationForm';
import { RegistrationForm } from './RegistrationForm';

export const UserProfileButton: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [userProfile, setUserProfile] = useState<RegistrationData | null>(() => {
    // Initialize from localStorage on mount
    try {
      const profile = getUserProfile();
      if (profile?.walletAddress === account) {
        return profile;
      }
    } catch (error) {
      console.error('Error loading initial profile:', error);
    }
    return null;
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const loadProfile = useCallback(() => {
    const profile = getUserProfile();
    if (account && profile?.walletAddress === account) {
      setUserProfile(profile);
      // Preload the image
      if (profile.avatar) {
        const img = new Image();
        img.src = profile.avatar;
        img.onload = () => setImagePreloaded(true);
      }
    } else {
      setUserProfile(null);
      setImagePreloaded(false);
    }
  }, [account]);

  useEffect(() => {
    loadProfile();

    const handleStorageChange = () => loadProfile();
    const handleProfileUpdate = (e: CustomEvent<RegistrationData>) => {
      if (account && e.detail.walletAddress === account) {
        setUserProfile(e.detail);
        if (e.detail.avatar) {
          const img = new Image();
          img.src = e.detail.avatar;
          img.onload = () => setImagePreloaded(true);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
      if (!account) {
        setUserProfile(null);
        setImagePreloaded(false);
      }
    };
  }, [account, loadProfile]);

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    navigate('/profile/edit');
  };

  const handleRegistrationSubmit = (data: RegistrationData) => {
    if (account) {
      // Create updated profile with wallet address
      const updatedProfile = {
        ...data,
        walletAddress: account,
        lastUpdated: new Date().toISOString()
      };

      try {
        // Save profile to localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        
        // Update local state
        setUserProfile(updatedProfile);
        
        // Dispatch custom event for immediate UI update
        const profileEvent = new CustomEvent('profileUpdated', {
          detail: updatedProfile
        });
        window.dispatchEvent(profileEvent);

        // Close forms
        setShowDropdown(false);
        setShowRegistrationForm(false);
        
        // Navigate to profile
        navigate('/profile');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to create profile. Please try again.');
      }
    } else {
      alert('Please connect your wallet to create a profile');
    }
  };

  return (
    <>
      <div className="relative z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative flex items-center space-x-2 text-white hover:bg-white/10 p-2 rounded-full overflow-hidden"
        >
          {account && userProfile?.avatar ? (
            <div className={`w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500/50 transition-opacity duration-200 ${imagePreloaded ? 'opacity-100' : 'opacity-0'}`}>
              <img 
                src={userProfile.avatar} 
                alt="Profile"
                className="w-full h-full object-cover"
                onLoad={() => setImagePreloaded(true)}
              />
              {!imagePreloaded && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-purple-300" />
                </div>
              )}
            </div>
          ) : (
            <UserCircle className="w-8 h-8" />
          )}
        </motion.button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-56 rounded-xl bg-gradient-to-br from-purple-900/90 to-black/90 
              backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden z-[90]"
          >
            {userProfile ? (
              <>
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="text-sm font-medium text-white">{userProfile.username}</div>
                  <div className="text-xs text-gray-400">{userProfile.profession}</div>
                </div>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-white text-sm cursor-pointer"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>View Profile</span>
                </motion.div>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={handleEditProfile}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-white text-sm cursor-pointer border-t border-white/10"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onClick={() => {
                  setShowRegistrationForm(true);
                  setShowDropdown(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-3 text-white text-sm cursor-pointer"
              >
                <UserCircle className="w-4 h-4" />
                <span>Create Profile</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      
      {showRegistrationForm && (
        <div className="fixed inset-0 z-[999] mt-16"> {/* Added mt-16 to account for navbar height */}
          <RegistrationForm
            onClose={() => setShowRegistrationForm(false)}
            onSubmit={handleRegistrationSubmit}
          />
        </div>
      )}
    </>
  );
};

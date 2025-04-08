import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Settings, User } from 'lucide-react';
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
    try {
      const profile = getUserProfile(account);
      if (profile && (!account || profile.walletAddress.toLowerCase() === account.toLowerCase())) {
        setUserProfile(profile);
        if (profile.avatar) {
          const img = new Image();
          img.src = profile.avatar;
          img.onload = () => setImagePreloaded(true);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [account]);

  useEffect(() => {
    loadProfile();
    
    if (!account) {
      setUserProfile(null);
      setImagePreloaded(false);
      // Remove navigation on disconnect
      setShowDropdown(false);
    }
    
    const handleStorageChange = () => loadProfile();
    const handleProfileUpdate = (e: CustomEvent<RegistrationData>) => loadProfile();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, [account, loadProfile]);

  const handleEditProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    navigate('/profile/edit');
  };

  const handleViewProfile = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleRegistrationSubmit = (data: RegistrationData) => {
    if (account) {
      const updatedProfile = {
        ...data,
        walletAddress: account,
        lastUpdated: new Date().toISOString()
      };

      try {
        // Save both with specific and generic keys
        localStorage.setItem(`userProfile_${account.toLowerCase()}`, JSON.stringify(updatedProfile));
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        localStorage.setItem('lastConnectedAccount', account);
        
        setUserProfile(updatedProfile);
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));

        setShowDropdown(false);
        setShowRegistrationForm(false);
        navigate('/posts');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to create profile. Please try again.');
      }
    } else {
      navigate('/posts');
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
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.username}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 
              flex items-center justify-center text-white font-bold">
              {userProfile?.username?.[0]?.toUpperCase() || <User size={16} />}
            </div>
          )}
        </motion.button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                  onClick={handleViewProfile}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-white text-sm cursor-pointer"
                >
                  <User className="w-4 h-4" />
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

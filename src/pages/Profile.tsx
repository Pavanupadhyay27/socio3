import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { Camera, Edit, ArrowLeft } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import type { RegistrationData } from '../components/RegistrationForm';

const Profile = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [userProfile, setUserProfile] = useState<RegistrationData | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!account) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const profile = await getUserProfile(account);
        if (profile) {
          setUserProfile(profile);
        } else {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate('/', { replace: true });
      }
    };

    loadProfile();
  }, [account, navigate]);

  if (!account || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl mb-4">Please connect your wallet and create a profile first</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-500"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 pointer-events-none" />
      <div className="container mx-auto px-4 py-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          {/* Hero Section */}
          <div className="relative h-32 md:h-40 rounded-t-2xl overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-black/90 backdrop-blur-xl">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 p-2.5 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 border border-white/20 shadow-lg flex items-center space-x-2 group"
            >
              <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-white text-sm pr-1">Home</span>
            </motion.button>

            {/* Profile Picture - Adjusted positioning */}
            <motion.div
              className="absolute -bottom-2 left-6 p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-xl" // Changed from -bottom-4
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-black/20 backdrop-blur-sm">
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover transform scale-110" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                    <Camera className="w-10 h-10 text-purple-300" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Edit Button - Enhanced */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/profile/edit')}
              className="absolute top-4 right-4 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20 border border-white/20 shadow-lg flex items-center space-x-2 group"
            >
              <Edit className="w-4 h-4 text-white" />
              <span className="text-white text-sm">Edit Profile</span>
            </motion.button>
          </div>

          {/* Main Content Section */}
          <div className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-b-2xl p-4 pt-4 
            backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
            {/* Header Section - Adjusted margin */}
            <div className="space-y-1.5 mt-[60px]"> {/* Added mt-[60px] to account for profile picture */}
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent" // Reduced from text-2xl
              >
                {userProfile.username}
              </motion.h1>
              <div className="flex items-center space-x-3 text-sm flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/20">
                  {userProfile.profession}
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full text-xs">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-2 bg-white/5 rounded-lg p-3 border border-white/10"> {/* Reduced padding */}
              <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                <span>About</span>
                <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent ml-4" />
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {userProfile.bio || "No bio yet"}
              </p>
            </div>

            {/* Interests Section */}
            <div className="space-y-2"> {/* Reduced spacing */}
              <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                <span>Interests</span>
                <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent ml-4" />
              </h2>
              <div className="flex flex-wrap gap-1"> {/* Reduced gap */}
                {userProfile.interests.map((interest, index) => (
                  <motion.span 
                    key={interest}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                      text-purple-300 rounded-full text-xs border border-purple-500/20 hover:border-purple-500/40 
                      transition-colors cursor-default"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2"> {/* Reduced spacing */}
              <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                <span>Connect</span>
                <div className="h-px flex-grow bg-gradient-to-r from-purple-500/50 to-transparent ml-4" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5"> {/* Reduced gap */}
                {Object.entries(userProfile.socialLinks).map(([platform, username]) => (
                  username && (
                    <motion.a
                      key={platform}
                      whileHover={{ scale: 1.02, y: -2 }}
                      href={`https://${platform}.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white/5 to-white/0 
                        rounded-xl hover:from-white/10 hover:to-white/5 transition-all duration-300 
                        border border-white/10 hover:border-white/20 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                        flex items-center justify-center">
                        <span className="text-base text-purple-300 group-hover:text-purple-200">
                          {platform === 'twitter' ? '𝕏' : platform === 'github' ? '𝔾' : '𝔻'}
                        </span>
                      </div>
                      <span className="text-gray-300 group-hover:text-white">@{username}</span>
                    </motion.a>
                  )
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
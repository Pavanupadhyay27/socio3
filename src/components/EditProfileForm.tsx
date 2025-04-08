import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { getUserProfile, setUserProfile } from '../utils/storage';
import type { RegistrationData } from './RegistrationForm';
import { Layout } from './Layout';

const INTERESTS = [
  "DeFi", "NFTs", "Gaming", "DAOs", "Web3", 
  "Metaverse", "Crypto", "Blockchain", "Trading",
  "Development", "Design", "Community"
];

const PROFESSIONS = [
  "Developer", "Designer", "Product Manager", "Entrepreneur",
  "Investor", "Trader", "Content Creator", "Marketing",
  "Student", "Other"
];

export function EditProfileForm() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    interests: [],
    profession: '',
    bio: '',
    socialLinks: {},
    avatar: ''
  });
  const [avatar, setAvatar] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!account) {
      navigate('/posts');
      return;
    }

    const profile = getUserProfile(account);
    if (profile) {
      setFormData(profile);
      setAvatar(profile.avatar || '');
    } else {
      navigate('/posts');
    }
  }, [account, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setUserProfile(formData, account!);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/posts');
      }, 1500);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile changes');
    }
  };

  const handleClose = () => {
    navigate('/posts');
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 pointer-events-none" />
        <AnimatePresence>
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-green-500/20 backdrop-blur-xl rounded-xl p-6 flex items-center space-x-3 border border-green-500/30"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-white">Profile updated successfully!</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-xl p-6 max-w-lg w-full relative backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar Upload - Updated styling */}
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <motion.div
                      className="w-24 h-24 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/50"
                      whileHover={{ scale: 1.05 }}
                    >
                      {avatar ? (
                        <div className="w-full h-full">
                          <img 
                            src={avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <Camera className="w-10 h-10 text-purple-300" />
                      )}
                    </motion.div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white shadow-lg hover:bg-purple-500 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                    </motion.button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Username */}
                  <div>
                    <label className="text-xs text-white/80 mb-1 block">Username *</label>
                    <input
                      required
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm"
                      placeholder="Choose a unique username"
                    />
                  </div>

                  {/* Profession */}
                  <div className="relative">
                    <label className="text-xs text-white/80 mb-1 block">Profession *</label>
                    <select
                      required
                      value={formData.profession}
                      onChange={e => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                      className="w-full bg-[#1a0938] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm
                        hover:bg-[#2a1148] transition-colors cursor-pointer focus:outline-none focus:ring-2 
                        focus:ring-purple-500/50 focus:border-transparent appearance-none"
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    >
                      <option value="" disabled style={{ background: '#1a0938' }}>Select your profession</option>
                      {PROFESSIONS.map(prof => (
                        <option 
                          key={prof} 
                          value={prof}
                          style={{ background: '#1a0938' }}
                        >
                          {prof}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-purple-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs text-white/80 mb-1 block">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm h-16"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="text-xs text-white/80 mb-1 block">Interests (Select up to 5) *</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {INTERESTS.map(interest => (
                      <motion.button
                        key={interest}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            interests: prev.interests.includes(interest)
                              ? prev.interests.filter(i => i !== interest)
                              : prev.interests.length < 5
                              ? [...prev.interests, interest]
                              : prev.interests
                          }))
                        }}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {interest}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-3 gap-2">
                  {['twitter', 'github', 'discord'].map((platform) => (
                    <div key={platform}>
                      <label className="text-xs text-white/60 mb-1 block capitalize">{platform}</label>
                      <input
                        type="text"
                        value={formData.socialLinks[platform] || ''}
                        placeholder={`@username`}
                        onChange={e => setFormData(prev => ({
                          ...prev,
                          socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                        }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
                      />
                    </div>
                  ))}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm mt-4"
                >
                  Save Changes
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}

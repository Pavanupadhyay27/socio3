import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Check } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface RegistrationFormProps {
  onClose: () => void;
  onSubmit: (data: RegistrationData) => void;
}

export interface RegistrationData {
  username: string;
  interests: string[];
  profession: string;
  bio: string;
  avatar?: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
}

const INTERESTS = [
  "DeFi", "NFTs", "Gaming", "DAOs", "Web3", 
  "Metaverse", "Crypto", "Blockchain", "Trading",
  "Development", "Design", "Community"
];

const PROFESSIONS = [
  "Developer",
  "Designer",
  "Product Manager",
  "Entrepreneur",
  "Investor",
  "Trader",
  "Content Creator",
  "Marketing",
  "Student",
  "Other"
];

export function RegistrationForm({ onClose, onSubmit }: RegistrationFormProps) {
  const { account, connect } = useWallet();
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    interests: [],
    profession: '',
    bio: '',
    socialLinks: {}
  });
  const [avatar, setAvatar] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      const connect = window.confirm("Please connect your wallet to continue. Connect now?");
      if (connect) {
        try {
          await connect();
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          return;
        }
      } else {
        return;
      }
    }
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-xl p-6 max-w-lg w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <motion.div
                className="w-20 h-20 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-purple-300" />
                )}
              </motion.div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white shadow-lg"
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

            {/* Profession - Updated Styling */}
            <div className="relative">
              <label className="text-xs text-white/80 mb-1 block">Profession *</label>
              <select
                required
                value={formData.profession}
                onChange={e => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm
                  hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 
                  focus:ring-purple-500/50 focus:border-transparent appearance-none"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                <option value="" disabled className="bg-gray-900">Select your profession</option>
                {PROFESSIONS.map(prof => (
                  <option 
                    key={prof} 
                    value={prof} 
                    className="bg-gray-900 text-white py-1 hover:bg-purple-600"
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
            Create Profile
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

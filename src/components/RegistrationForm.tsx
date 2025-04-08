import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Upload } from 'lucide-react';

interface RegistrationFormProps {
  onClose: () => void;
  onSubmit: (data: RegistrationData) => void;
}

export interface RegistrationData {
  username: string;
  bio?: string;
  avatar?: string;
  interests: string[];
  profession: string;
  socialLinks: {
    [key: string]: string;
  };
}

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

export function RegistrationForm({ onClose, onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    bio: '',
    avatar: '',
    interests: [],
    profession: '',
    socialLinks: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.profession || formData.interests.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const accounts = await window.ethereum?.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Please connect your wallet first');
      }

      // Submit form data and let parent handle navigation
      await onSubmit({
        ...formData,
        walletAddress: accounts[0],
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 4001) {
        alert('Please accept the wallet connection request');
      } else {
        alert(error.message || 'Failed to register. Please try again.');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 p-3 w-[380px] mx-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Complete Your Profile</h2>
        <motion.button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Avatar Upload */}
        <div className="flex justify-center mb-4">
          <div className="relative group">
            <motion.div
              className="w-20 h-20 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/50"
              whileHover={{ scale: 1.05 }}
            >
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-purple-300" />
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

        {/* Username and Profession */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/80 mb-1 block">Username *</label>
            <input
              required
              type="text"
              value={formData.username}
              onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40
                focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="Choose a username"
            />
          </div>

          <div className="relative">
            <label className="text-xs text-white/80 mb-1 block">Profession *</label>
            <select
              required
              value={formData.profession}
              onChange={e => setFormData(prev => ({ ...prev, profession: e.target.value }))}
              className="w-full bg-[#1a0938] border border-white/10 rounded-lg px-3 py-2 text-sm text-white
                focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="" className="bg-[#1a0938] text-white">Select...</option>
              {PROFESSIONS.map(prof => (
                <option key={prof} value={prof} className="bg-[#1a0938] text-white">
                  {prof}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform translate-y-1 pointer-events-none text-purple-400">
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
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40
              focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all h-16 resize-none"
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
        <div className="grid grid-cols-1 gap-2 mt-3">
          {['twitter', 'github', 'discord'].map(platform => (
            <div key={platform} className="flex items-center gap-2">
              <span className="w-14 text-xs text-white/60 capitalize">{platform}</span>
              <input
                type="text"
                value={formData.socialLinks[platform] || ''}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white 
                  focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                placeholder={`@username`}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!formData.username || !formData.profession || formData.interests.length === 0}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg 
            font-medium hover:from-purple-500 hover:to-pink-500 transition-all mt-4 text-sm
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600"
        >
          Complete Profile
        </motion.button>
      </form>
    </motion.div>
  );
}

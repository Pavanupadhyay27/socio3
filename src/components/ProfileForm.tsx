import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ProfileFormProps {
  onClose: () => void;
  onSubmit: (data: { username: string; interests: string[]; profession: string }) => void;
}

const INTEREST_OPTIONS = [
  "DeFi", "NFTs", "Gaming", "DAOs", "Web3", 
  "Metaverse", "Crypto", "Blockchain", "Trading"
];

const PROFESSION_OPTIONS = [
  "Developer",
  "Designer",
  "Product Manager",
  "Entrepreneur",
  "Investor",
  "Trader",
  "Content Creator",
  "Marketing Professional",
  "Student",
  "Other"
];

export const ProfileForm = ({ onClose, onSubmit }: ProfileFormProps) => {
  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [profession, setProfession] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, interests, profession });
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl p-8 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Complete Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Profession</label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white appearance-none"
              required
            >
              <option value="" disabled>Select your profession</option>
              {PROFESSION_OPTIONS.map((prof) => (
                <option key={prof} value={prof} className="bg-purple-900">
                  {prof}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white mb-2">Select Your Interests</label>
            <div className="grid grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <motion.button
                  key={interest}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleInterest(interest)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    interests.includes(interest)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!username || !profession || interests.length === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg py-3 font-medium
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Profile
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

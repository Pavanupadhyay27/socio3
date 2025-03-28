import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    image: string;
    walletAddress: string;
  };
  onSave: (profile: any) => void;
  walletAddress: string;
}

export function ProfileModal({ isOpen, onClose, profile, onSave, walletAddress }: ProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [imagePreview, setImagePreview] = useState(profile.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      name,
      image: imagePreview,
      walletAddress
    });
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify({
      name,
      image: imagePreview,
      walletAddress
    }));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-purple-900/90 to-black/90 p-6 rounded-2xl border border-white/10 
              backdrop-blur-xl shadow-2xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Account</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="relative group">
                  <motion.div
                    className="w-24 h-24 rounded-full overflow-hidden bg-purple-500/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-purple-300" />
                      </div>
                    )}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full 
                      text-white shadow-lg hover:bg-purple-500 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent"
                  placeholder="Enter your display name"
                />
              </div>

              {/* Wallet Address */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Wallet Address</label>
                <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2
                  text-gray-400 text-sm font-mono break-all">
                  {walletAddress}
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600
                  hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold"
              >
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

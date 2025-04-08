import { Link, useNavigate } from 'react-router-dom';
import { Plus, User, Search } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { getUserProfile } from '../utils/storage';
import { RegistrationForm } from './RegistrationForm';
import { ConnectWallet } from './ConnectWallet';
import { UserProfileButton } from './UserProfileButton';

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

    navigate('/posts/create');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-br from-purple-400 to-pink-500 bg-clip-text text-transparent">#</span>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">hash</span>
            <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-pink-400 bg-clip-text text-transparent">dit</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts, tags, communities..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white 
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        {/* Right Actions - Reordered */}
        <div className="flex items-center gap-4">
          {account && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePost}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
              >
                <Plus size={20} />
                <span className="hidden md:inline">Create Post</span>
              </motion.button>
              <UserProfileButton />
            </>
          )}
          <div className="ml-2">
            <ConnectWallet />
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
              navigate('/posts/create');
            }}
          />
        </div>
      )}
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  TrendingUp as Trending,
  Users,
  Award,
  Shield,
  Sparkles,
  Search,
  Bell,
  Menu,
  Home,
  Star,
  PlusCircle,
  Github,
  Twitter,
  Disc,
  Sun,
  LogOut,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import FireIcon from './components/FireIcon';
import { ProfileForm } from './components/ProfileForm';
import StarBackground from './components/StarBackground';
import { LoadingOverlay } from './components/LoadingOverlay';
import { useLoading } from './contexts/LoadingContext';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import StarFooterBackground from './components/StarFooterBackground';
import { getUserProfile } from './utils/storage';
import { UserProfileButton } from './components/UserProfileButton';
import { Outlet } from 'react-router-dom';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
    <div className="text-center p-8 bg-black/30 backdrop-blur-xl rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
      <pre className="text-red-400 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
      >
        Try again
      </button>
    </div>
  </div>
);

const WalletButton = () => {
  const { account, connect, disconnect, isConnecting } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      // You might want to show an error toast here
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      {account ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 
              rounded-full text-white font-medium"
          >
            <span>{formatAddress(account)}</span>
          </motion.button>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 rounded-xl bg-gradient-to-br from-purple-900/90 to-pink-900/90 
                backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden z-50"
            >
              <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onClick={handleDisconnect}
                className="flex items-center space-x-2 w-full px-4 py-3 text-white text-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </motion.div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleConnect}
          disabled={isConnecting}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white 
            font-medium hover:from-purple-500 hover:to-pink-500 disabled:opacity-75"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </motion.button>
      )}
    </div>
  );
};

const AnimatedSearchPlaceholder = () => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "Search by community...",
    "Search by user...",
    "Search by tag...",
    "Search Web3Social..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.input
      type="text"
      key={placeholderIndex}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      placeholder={placeholders[placeholderIndex]}
      className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-12 
        text-white placeholder-gray-500 focus:outline-none focus:ring-2 
        focus:ring-purple-500/50 focus:border-transparent focus:bg-white/10 
        transition-all duration-300 hover:bg-white/[0.07]"
    />
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const { withLoading } = useLoading();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleProfileSubmit = (data: { username: string; interests: string[]; profession: string }) => {
    setShowProfileForm(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const BoxBackground: React.FC = () => (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent opacity-40" />
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-br from-purple-500/5 to-transparent backdrop-blur-sm rounded-full"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WalletProvider>
        <div className="flex flex-col min-h-screen bg-black">
          <LoadingOverlay />
          <StarBackground />
          <BoxBackground />
          
          <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-md">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"
              animate={{ backgroundColor: ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            />
            <div className="container mx-auto px-4">
              <div className="flex items-center h-16 relative z-10">
                <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 flex items-center space-x-3 mr-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(147, 51, 234, 0.3)',
                          '0 0 40px rgba(147, 51, 234, 0.5)',
                          '0 0 20px rgba(147, 51, 234, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative"
                    >
                      <MessageCircle className="w-8 h-8 text-white" />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-30" />
                    </motion.div>
                  </motion.div>
                  <motion.span
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
                    animate={{
                      textShadow: [
                        '0 0 8px rgba(255,255,255,0.5)',
                        '0 0 12px rgba(255,255,255,0.2)',
                        '0 0 8px rgba(255,255,255,0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Web3Social
                  </motion.span>
                </motion.div>
                <div className="hidden lg:flex items-center space-x-1">
                  {[
                    { icon: Home, label: 'Home', id: 'home', glow: '#4F46E5' },
                    { icon: FireIcon, label: 'Popular', id: 'popular', glow: '#FF4D4D' },
                    { icon: Star, label: 'All', id: 'features', glow: '#FFD700' },
                  ].map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => scrollToSection(item.id)}
                      whileHover={{ scale: 1.05, y: -2, boxShadow: `0 0 20px ${item.glow}40` }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white transform-gpu relative group"
                    >
                      <motion.div
                        className="relative"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <item.icon className="w-5 h-5" />
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{
                            boxShadow: [
                              `0 0 0px ${item.glow}00`,
                              `0 0 20px ${item.glow}60`,
                              `0 0 0px ${item.glow}00`,
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="hidden md:flex flex-1 justify-center px-4 relative">
                  <motion.div className="w-full max-w-md" whileFocus={{ scale: 1.02 }}>
                    <div className="relative group">
                      <AnimatedSearchPlaceholder />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <motion.div
                          initial={false}
                          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Search className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/create')}
                    className="hidden md:flex items-center space-x-1 text-white hover:bg-white/10 px-3 py-1.5 rounded-full"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="relative text-white hover:bg-white/10 p-2 rounded-full"
                  >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </motion.button>
                  <UserProfileButton />
                  <WalletButton />
                  <button className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-grow mt-16 pb-24">
            <Outlet />
          </main>

          <footer className="relative mt-auto w-full bg-transparent border-t border-white/10 py-16">
            <div className="absolute inset-0">
              <StarFooterBackground />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
                    >
                      <MessageCircle className="w-8 h-8 text-white" />
                    </motion.div>
                    <span className="text-2xl font-bold text-white">Web3Social</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    The next generation of social discussion powered by Web3 technology. Connect, engage, and shape the future together.
                  </p>
                </motion.div>
                {[
                  { title: 'Platform', links: ['About', 'Features', 'Roadmap', 'Careers'] },
                  { title: 'Resources', links: ['Documentation', 'Help Center', 'Blog', 'Community'] },
                ].map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-white font-semibold mb-6 text-lg">{section.title}</h3>
                    <ul className="space-y-4">
                      {section.links.map((link) => (
                        <motion.li key={link}>
                          <motion.a href="#" className="text-gray-400 hover:text-white transition-colors relative group" whileHover={{ x: 5 }}>
                            {link}
                            <motion.span
                              className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full"
                              transition={{ duration: 0.3 }}
                            />
                          </motion.a>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-white font-semibold mb-6 text-lg">Connect</h3>
                  <div className="flex space-x-4">
                    {[
                      { icon: Twitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
                      { icon: Disc, href: '#', label: 'Discord', color: '#5865F2' },
                      { icon: Github, href: '#', label: 'Github', color: '#fff' },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        whileHover={{ scale: 1.1, rotate: 360, backgroundColor: `${social.color}30` }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="relative p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors transform-gpu backdrop-blur-lg border border-white/10"
                      >
                        <social.icon className="w-5 h-5" />
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{
                            boxShadow: [
                              `0 0 0px ${social.color}00`,
                              `0 0 20px ${social.color}40`,
                              `0 0 0px ${social.color}00`,
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 text-center text-gray-400 text-sm"
              >
                <p>© {new Date().getFullYear()} Web3Social. All rights reserved.</p>
              </motion.div>
            </div>
          </footer>

          {showProfileForm && <ProfileForm onClose={() => setShowProfileForm(false)} onSubmit={handleProfileSubmit} />}
        </div>
      </WalletProvider>
    </ErrorBoundary>
  );
};

export default App;
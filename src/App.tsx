import React, { useState, useEffect } from 'react';
import { motion, cubicBezier } from 'framer-motion';
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
  Wallet,
  Home,
  Star,
  PlusCircle,
  Github,
  Twitter,
  Disc,
  Sun
} from 'lucide-react';
import FireIcon from './components/FireIcon';
import WalletModal from './components/WalletModal';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { CreateContent } from './pages/CreateContent'; // Ensure the file exists at ./pages/CreateContent.tsx or create it if missing

const connectWallet = async (walletName: string) => {
  try {
    switch (walletName.toLowerCase()) {
      case 'metamask':
        if (window.ethereum?.isMetaMask) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          return accounts[0];
        }
        throw new Error('MetaMask not installed');
      
      case 'phantom':
        if (window.phantom?.solana || window.solana) {
          const provider = window.phantom?.solana || window.solana;
          const resp = await provider.connect();
          return resp.publicKey.toString();
        }
        throw new Error('Phantom not installed');
      
      case 'coinbase':
        if (window.ethereum?.isCoinbaseWallet || window.coinbaseWallet) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          return accounts[0];
        }
        throw new Error('Coinbase Wallet not installed');

      case 'trust wallet':
        if (window.ethereum?.isTrust || window.trustWallet) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          return accounts[0];
        }
        throw new Error('Trust Wallet not installed');

      case 'keplr':
        if (window.keplr || window.getOfflineSigner) {
          await window.keplr?.enable('cosmoshub-4');
          const accounts = await window.keplr?.getKey('cosmoshub-4');
          return accounts.bech32Address;
        }
        throw new Error('Keplr not installed');

      case 'okx':
        if (window.okxwallet || window.okex) {
          const accounts = await window.okxwallet?.request({ method: 'eth_requestAccounts' });
          return accounts[0];
        }
        throw new Error('OKX Wallet not installed');
        
      case 'walletconnect':
        // Implement WalletConnect logic here
        return 'wallet_connect_address';

      case 'ton wallet':
        if (window.ton) {
          const accounts = await window.ton.send('ton_requestAccounts');
          localStorage.setItem('connectedWallet', 'TON');
          return accounts[0];
        } else if (window.tonwallet?.isConnected) {
          return window.tonwallet.account;
        }
        throw new Error('TON Wallet not installed');

      case 'sui wallet':
        if (window.sui) {
          const response = await window.sui.connect();
          localStorage.setItem('connectedWallet', 'Sui');
          return response.address;
        }
        throw new Error('Sui Wallet not installed');

      default:
        throw new Error('Wallet not supported');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

const disconnectWallet = async (walletName: string) => {
  try {
    switch (walletName) {
      case 'MetaMask':
        if (window.ethereum?.isMetaMask) {
          await window.ethereum.request({ method: 'wallet_disconnect' });
        }
        break;
      
      case 'Phantom':
        if (window.solana) {
          await window.solana.disconnect();
        }
        break;
      
      case 'TON Wallet':
        if (window.ton) {
          await window.ton.send('ton_disconnect');
        }
        break;

      case 'Sui Wallet':
        if (window.sui) {
          await window.sui.disconnect();
        }
        break;

      // Add other wallet disconnections...
    }
    localStorage.removeItem('connectedWallet');
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
};

const GlowingUniverse = () => {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number; delay: number }[]>([]);

  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: 150 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4,
        opacity: Math.random(),
        delay: Math.random() * 2
      }));
    };
    setStars(generateStars());
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}
          animate={{
            opacity: [star.opacity, 0.2, star.opacity],
            scale: [1, 1.5, 1],
            filter: ['blur(0px)', 'blur(2px)', 'blur(0px)']
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-radial-glow opacity-30" />
    </div>
  );
};

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connectedWalletName, setConnectedWalletName] = useState<string>('');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      handleConnectWallet(savedWallet);
    }
  }, []);

  const handleConnectWallet = async (walletName: string) => {
    try {
      const address = await connectWallet(walletName);
      setWalletAddress(address);
      setConnectedWalletName(walletName);
      setIsWalletConnected(true);
      setIsWalletModalOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnectWallet = async () => {
    if (connectedWalletName) {
      await disconnectWallet(connectedWalletName);
      setWalletAddress('');
      setConnectedWalletName('');
      setIsWalletConnected(false);
    }
  };

  const handleWalletButtonClick = () => {
    setIsWalletModalOpen(true); // Always open modal, don't disconnect directly
  };

  const handleGetStarted = () => {
    if (!isWalletConnected) {
      setIsWalletModalOpen(true);
    } else {
      navigate('/create');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const BoxBackground = () => (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-3xl rounded-2xl"
          initial={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotateX: 0,
            rotateY: 0,
            opacity: 0
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight],
            rotateX: [0, 360],
            rotateY: [0, 360],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: cubicBezier(0.4, 0, 0.2, 1),
          }}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      <BoxBackground />
      
      {/* Enhanced Navbar with Smooth Scroll */}
      <nav className="fixed w-full z-50">
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"
          animate={{
            backgroundColor: ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.3)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 relative z-10">
            {/* Left section with enhanced 3D logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center space-x-3 mr-6"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(147, 51, 234, 0.3)',
                      '0 0 40px rgba(147, 51, 234, 0.5)',
                      '0 0 20px rgba(147, 51, 234, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
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
                    '0 0 8px rgba(255,255,255,0.5)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Web3Social
              </motion.span>
            </motion.div>
              
            {/* Enhanced navigation buttons */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { icon: Home, label: "Home", id: "home", glow: "#4F46E5" },
                { icon: FireIcon, label: "Popular", id: "popular", glow: "#FF4D4D" },
                { icon: Star, label: "All", id: "features", glow: "#FFD700" }
              ].map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    boxShadow: `0 0 20px ${item.glow}40`
                  }}
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
                          `0 0 0px ${item.glow}00`
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Search Bar with enhanced animation */}
            <div className="hidden md:flex flex-1 justify-center px-4 relative">
              <motion.div 
                className="w-full max-w-2xl"
                whileFocus={{ scale: 1.02 }}
              >
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search Web3Social"
                    className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                  />
                  <motion.div
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    initial={false}
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-300 transition-colors" />
                  </motion.div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    /
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center space-x-1 text-white hover:bg-white/10 px-3 py-1.5 rounded-full"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex items-center space-x-1 text-white hover:bg-white/10 p-2 rounded-full"
              >
                <Sun className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative text-white hover:bg-white/10 p-2 rounded-full"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 15,
                  boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWalletButtonClick}
                className={`hidden md:flex items-center space-x-2 px-4 py-1.5 rounded-full transform-gpu ${
                  isWalletConnected 
                    ? 'bg-gradient-to-r from-green-500/30 to-green-400/30 text-green-400' 
                    : 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-400'
                } border border-white/20 backdrop-blur-sm`}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                <Wallet className="w-5 h-5" />
                <span>{isWalletConnected ? 
                  `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 
                  'Connect Wallet'
                }</span>
              </motion.button>

              <button className="md:hidden text-white">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <Outlet />

      {/* Popular Section */}
      <div id="popular" className="relative overflow-hidden pt-16">
        {/* Add your popular section content here */}
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 bg-black/20 p-8 rounded-3xl backdrop-blur-lg">
          {[
            { 
              icon: MessageCircle, 
              title: "Engaging Discussions", 
              description: "Participate in meaningful conversations with a global community",
              color: "#818CF8", // Indigo
              gradient: "from-indigo-500/20 to-indigo-500/5"
            },
            { 
              icon: Users, 
              title: "Vibrant Communities", 
              description: "Join or create communities around your interests",
              color: "#F472B6", // Pink
              gradient: "from-pink-500/20 to-pink-500/5"
            },
            { 
              icon: Trending, 
              title: "Trending Topics", 
              description: "Stay updated with what's hot and happening",
              color: "#34D399", // Emerald
              gradient: "from-emerald-500/20 to-emerald-500/5"
            },
            { 
              icon: Award, 
              title: "Rewards System", 
              description: "Earn rewards for quality contributions",
              color: "#FBBF24", // Amber
              gradient: "from-amber-500/20 to-amber-500/5"
            },
            { 
              icon: Shield, 
              title: "Enhanced Security", 
              description: "Your privacy and security are our top priority",
              color: "#60A5FA", // Blue
              gradient: "from-blue-500/20 to-blue-500/5"
            },
            { 
              icon: Sparkles, 
              title: "Rich Features", 
              description: "Experience next-generation social features",
              color: "#A78BFA", // Purple
              gradient: "from-purple-500/20 to-purple-500/5"
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                }
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 10,
                translateY: -10,
              }}
              className="group relative transform perspective-1000 preserve-3d cursor-pointer"
            >
              <div 
                className={`relative bg-gradient-to-br ${feature.gradient} 
                  backdrop-blur-xl rounded-2xl p-8 h-full border border-white/10
                  shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                  transition-all duration-300 
                  group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                  transform-gpu preserve-3d
                `}
              >
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <motion.div
                  className="relative flex items-center justify-center w-16 h-16 mb-8 
                    rounded-2xl bg-gradient-to-br from-white/10 to-white/5
                    transform-gpu preserve-3d translate-z-20"
                  animate={{
                    boxShadow: [
                      `0 0 20px ${feature.color}20`,
                      `0 0 40px ${feature.color}40`,
                      `0 0 20px ${feature.color}20`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <feature.icon 
                    className="w-8 h-8 transform-gpu transition-transform duration-300 
                      group-hover:scale-110 group-hover:rotate-[-10deg]" 
                    style={{ color: feature.color }}
                  />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4 
                  transform-gpu transition-transform duration-300 
                  group-hover:translate-z-10"
                >
                  {feature.title}
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed
                  transform-gpu transition-all duration-300 
                  group-hover:text-white group-hover:translate-z-10"
                >
                  {feature.description}
                </p>

                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 
                    transform translate-y-2 group-hover:opacity-100 
                    group-hover:translate-y-0 transition-all duration-300"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: feature.color }}>
                    Learn more 
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      →
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center bg-gradient-to-br from-purple-900/30 to-pink-900/30 
            backdrop-blur-lg rounded-3xl p-12 border border-white/10 
            shadow-[0_0_50px_rgba(168,85,247,0.2)]"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            whileInView={{ scale: 1, y: 0 }}
            transition={{ 
              delay: 0.2,
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            className="relative z-10 space-y-8"
          >
            <div className="relative inline-block">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text 
                  bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400
                  py-3" // Added vertical padding
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% auto',
                }}
              >
                Ready to Join?
              </motion.h2>
              <div className="absolute -inset-x-6 -top-8 -bottom-6 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-2xl" />
            </div>
            <motion.p 
              className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Join our vibrant Web3 community and start engaging with like-minded individuals today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(168,85,247,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-8 py-4 md:px-12 md:py-5 rounded-2xl 
                  bg-gradient-to-r from-purple-600 to-pink-600
                  hover:from-purple-500 hover:to-pink-500
                  text-white text-lg md:text-xl font-semibold
                  transform-gpu transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Join Community
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                  from-purple-600/50 to-pink-600/50 blur-xl opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300" 
                />
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 md:px-12 md:py-5 rounded-2xl
                  border-2 border-white/20 hover:border-white/40
                  text-white text-lg md:text-xl font-semibold
                  transition-all duration-300 backdrop-blur-sm"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black/30 via-black/40 to-black/50 backdrop-blur-lg border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo and Description */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
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

            {/* Quick Links */}
            {[
              {
                title: "Platform",
                links: ["About", "Features", "Roadmap", "Careers"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "Blog", "Community"]
              }
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
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors relative group"
                        whileHover={{ x: 5 }}
                      >
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

            {/* Social Links */}
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
                  { icon: Twitter, href: "#", label: "Twitter", color: "#1DA1F2" },
                  { icon: Disc, href: "#", label: "Discord", color: "#5865F2" },
                  { icon: Github, href: "#", label: "Github", color: "#fff" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 360,
                      backgroundColor: `${social.color}30`
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="relative p-3 rounded-full bg-white/5 text-gray-400 hover:text-white 
                      transition-colors transform-gpu backdrop-blur-lg border border-white/10"
                  >
                    <social.icon className="w-5 h-5" />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          `0 0 0px ${social.color}00`,
                          `0 0 20px ${social.color}40`,
                          `0 0 0px ${social.color}00`
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="sr-only">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Web3Social. All rights reserved.
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Wallet Modal */}
      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
        connectedWallet={connectedWalletName}
        onDisconnect={handleDisconnectWallet}
        walletAddress={walletAddress}
      />
    </div>
  );
}

export default App;
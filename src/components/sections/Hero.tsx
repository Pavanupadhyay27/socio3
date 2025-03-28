import { motion } from 'framer-motion';
import { ArrowRight, Globe2, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RegistrationForm, RegistrationData } from '../RegistrationForm';
import { useWallet } from '../../contexts/WalletContext';

export const Hero = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const { account, connect } = useWallet();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (!account) {
      const shouldConnect = window.confirm("Please connect your wallet to continue. Connect now?");
      if (shouldConnect) {
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
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = (data: RegistrationData) => {
    // Save to localStorage or your backend
    localStorage.setItem('userProfile', JSON.stringify(data));
    setShowRegistration(false);
    // Navigate to dashboard or home
    window.location.href = '/dashboard';
  };

  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 z-0" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                The Future of Social
              </span>
              <br />
              <span className="text-white">
                is Decentralized
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Connect, share, and build with the next generation of social networking
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/20"
              >
                Learn More
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Globe2, title: 'Global Community', desc: 'Connect with users worldwide' },
                { icon: Shield, title: 'Secure & Private', desc: 'Your data belongs to you' },
                { icon: Zap, title: 'Lightning Fast', desc: 'Instant interactions' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="glass p-6 rounded-xl backdrop-blur-lg"
                >
                  <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500/30 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-pink-500/30 rounded-full blur-[120px]" />
        </div>
      </div>

      {showRegistration && (
        <RegistrationForm
          onClose={() => setShowRegistration(false)}
          onSubmit={handleRegistrationSubmit}
        />
      )}
    </div>
  );
};

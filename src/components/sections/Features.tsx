import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe2, Users, Code2, Coins, Laptop, Network, Lock } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      title: 'Seamless Integration',
      description: 'Connect with multiple wallets effortlessly',
      icon: Shield,
      gradient: 'from-purple-600/20 to-pink-600/20'
    },
    {
      title: 'Lightning Fast',
      description: 'Experience blazing fast transactions',
      icon: Zap,
      gradient: 'from-blue-600/20 to-purple-600/20'
    },
    {
      title: 'Global Community',
      description: 'Connect with users worldwide',
      icon: Globe2,
      gradient: 'from-pink-600/20 to-red-600/20'
    },
    {
      title: 'Social Integration',
      description: 'Connect your existing social networks',
      icon: Users,
      gradient: 'from-indigo-600/20 to-purple-600/20'
    },
    {
      title: 'Developer Friendly',
      description: 'Built with modern web3 technologies',
      icon: Code2,
      gradient: 'from-green-600/20 to-emerald-600/20'
    },
    {
      title: 'Token Rewards',
      description: 'Earn rewards for your contributions',
      icon: Coins,
      gradient: 'from-yellow-600/20 to-amber-600/20'
    },
    {
      title: 'Cross Platform',
      description: 'Available on all your devices',
      icon: Laptop,
      gradient: 'from-purple-600/20 to-violet-600/20'
    },
    {
      title: 'Decentralized',
      description: 'True peer-to-peer networking',
      icon: Network,
      gradient: 'from-cyan-600/20 to-blue-600/20'
    },
    {
      title: 'Privacy Focused',
      description: 'Your data remains yours',
      icon: Lock,
      gradient: 'from-rose-600/20 to-pink-600/20'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Revolutionary Web3
            </span>
            <br />
            <span className="text-white">
              Social Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of social networking with our comprehensive suite of features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-white/10 p-6 rounded-xl
                hover:scale-105 transform transition-transform duration-300 relative group`}
            >
              <div className="absolute inset-0 bg-black/50 rounded-xl backdrop-blur-sm opacity-0 
                group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 
                  text-white mb-4 transform transition-all duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 
                transition-colors duration-300" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity 
                duration-300 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

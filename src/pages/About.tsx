import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Shield, Users, Zap, Globe2, Code2, Lock, Network, Coins } from 'lucide-react';
import StarBackground from '../components/StarBackground';

const About = () => {
  return (
    <Layout>
      <div className="relative min-h-screen">
        <StarBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/0 to-black/80 pointer-events-none" />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-16"
          >
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  The Future of
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Social Networking
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hashdit is pioneering the next generation of social interaction through Web3 technology, 
                creating a space where ownership, privacy, and community converge.
              </motion.p>
            </div>

            {/* Mission Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                We're building a decentralized ecosystem where users have complete control over their digital presence.
                By leveraging blockchain technology, we ensure transparency, security, and fair rewards for all community members.
              </p>
            </motion.section>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Privacy First',
                  description: 'Your data remains yours, secured by blockchain technology.',
                  gradient: 'from-blue-600/20 to-cyan-600/20'
                },
                {
                  icon: Users,
                  title: 'Community Driven',
                  description: 'A platform shaped by its users, for its users.',
                  gradient: 'from-purple-600/20 to-pink-600/20'
                },
                {
                  icon: Coins,
                  title: 'Token Rewards',
                  description: 'Earn rewards for valuable contributions.',
                  gradient: 'from-yellow-600/20 to-orange-600/20'
                },
                {
                  icon: Network,
                  title: 'Decentralized',
                  description: 'True peer-to-peer networking without intermediaries.',
                  gradient: 'from-green-600/20 to-emerald-600/20'
                },
                {
                  icon: Code2,
                  title: 'Open Source',
                  description: 'Transparent and community-audited codebase.',
                  gradient: 'from-red-600/20 to-rose-600/20'
                },
                {
                  icon: Lock,
                  title: 'Self Custody',
                  description: 'Full control over your digital assets.',
                  gradient: 'from-indigo-600/20 to-violet-600/20'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${feature.gradient} rounded-xl p-6 backdrop-blur-sm 
                    border border-white/10 hover:border-white/20 transition-all duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;

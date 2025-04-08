import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-gradient-to-b from-black via-purple-900/10 to-purple-900/20 border-t border-white/10">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              hashdit
            </h3>
            <p className="text-gray-400 text-sm">
              Connect. Create. Earn. Join the future of social interaction on Web3.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => navigate('/about')} className="block text-gray-400 hover:text-purple-400">About</button>
              <button onClick={() => navigate('/profile')} className="block text-gray-400 hover:text-purple-400">Profile</button>
              <button onClick={() => navigate('/posts')} className="block text-gray-400 hover:text-purple-400">Home</button>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <div className="space-y-2">
              <button className="block text-gray-400 hover:text-purple-400">Documentation</button>
              <button className="block text-gray-400 hover:text-purple-400">Help Center</button>
              <button className="block text-gray-400 hover:text-purple-400">Privacy Policy</button>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">Community</h4>
            <div className="flex items-center gap-4">
              <motion.a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <Github size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="https://discord.com" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              >
                <MessageCircle size={20} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">© 2024 Hashdit. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white/60 hover:text-white">Terms</a>
            <a href="#" className="text-white/60 hover:text-white">Privacy</a>
            <a href="#" className="text-white/60 hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

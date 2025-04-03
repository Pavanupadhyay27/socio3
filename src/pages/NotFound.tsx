import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/90 to-black/90 p-8 rounded-xl 
          backdrop-blur-xl border border-white/10 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-pink-500/10 rounded-full blur-[100px]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-white mb-4"
          >
            404
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
          
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
              text-white font-medium inline-flex items-center gap-2 group"
          >
            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            Return Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

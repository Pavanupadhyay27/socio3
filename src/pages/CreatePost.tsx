import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreatePostForm } from '../components/posts/CreatePostForm';
import { ArrowLeft, ImagePlus } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl"
            >
              <ImagePlus className="w-6 h-6 text-purple-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Create Post</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.button>
        </div>

        <CreatePostForm />
      </motion.div>
    </div>
  );
};

export default CreatePost;

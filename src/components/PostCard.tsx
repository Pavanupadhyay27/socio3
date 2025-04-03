import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Post } from '../types/post';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from 'lucide-react';
import { getUserProfile } from '../utils/storage';

interface PostCardProps {
  post: Post;
  account: string | null;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onComment: (postId: string) => void;
  onShare: (post: Post) => void;
}

export const PostCard = memo(({ post, account, onVote, onComment, onShare }: PostCardProps) => {
  const userProfile = getUserProfile(post.authorAddress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-900/30 via-black/50 to-pink-900/20 rounded-xl 
        border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all 
        shadow-xl hover:shadow-purple-500/10 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 
          flex items-center justify-center text-white font-bold text-lg border-2 border-white/10">
          {userProfile?.username?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400">
              Posted by {userProfile?.username || 'Anonymous'}
            </span>
          </div>
        </div>
      </div>

      <div className="text-gray-300 leading-relaxed mb-4">
        {post.content}
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onVote(post.id, 'up')}
          className={`flex items-center gap-2 ${
            post.votes.up.includes(account || '') 
              ? 'text-green-400' 
              : 'text-gray-400'
          }`}
        >
          <ThumbsUp size={18} />
          <span>{post.votes.up.length}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onVote(post.id, 'down')}
          className={`flex items-center gap-2 ${
            post.votes.down.includes(account || '') 
              ? 'text-red-400' 
              : 'text-gray-400'
          }`}
        >
          <ThumbsDown size={18} />
          <span>{post.votes.down.length}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-gray-400"
        >
          <MessageCircle size={18} />
          <span>{post.comments.length}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare(post)}
          className="flex items-center gap-2 text-gray-400"
        >
          <Share2 size={18} />
          <span>Share</span>
        </motion.button>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.votes === nextProps.post.votes &&
    prevProps.account === nextProps.account
  );
});

PostCard.displayName = 'PostCard';

import { motion } from 'framer-motion';
import { UserCircle, Hash } from 'lucide-react';
import { Post } from '../../types/Post';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 p-6"
    >
      <div className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 overflow-hidden">
            {post.authorProfilePic ? (
              <img src={post.authorProfilePic} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-6 h-6 text-purple-300" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">{post.title}</h3>
            <div className="text-sm text-gray-400">{post.authorName}</div>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-300">{post.content}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs"
              >
                <Hash className="inline w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

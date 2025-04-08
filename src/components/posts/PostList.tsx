import { useState } from 'react';
import { motion } from 'framer-motion';
import { Post } from '../../types/Post';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  postsPerPage?: number;
}

export const PostList = ({ posts, postsPerPage = 4 }: PostListProps) => {
  const [visiblePosts, setVisiblePosts] = useState(postsPerPage);

  const handleSeeMore = () => {
    setVisiblePosts(prev => prev + postsPerPage);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {posts.slice(0, visiblePosts).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {visiblePosts < posts.length && (
        <div className="flex justify-center pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSeeMore}
            className="px-6 py-2 bg-purple-600/20 hover:bg-purple-600/30 
              text-purple-300 rounded-lg transition-colors"
          >
            See More Posts
          </motion.button>
        </div>
      )}
    </div>
  );
};

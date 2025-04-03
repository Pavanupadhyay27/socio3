import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Post, getPosts, savePost } from '../utils/postStorage';
import { useWallet } from '../contexts/WalletContext';
import { getUserProfile } from '../utils/storage';
import {
  MessageCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
  ArrowDown,
  X,
  Send,
} from 'lucide-react';

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const { account } = useWallet();
  const userProfile = getUserProfile();

  useEffect(() => {
    const allPosts = getPosts();
    const sortedPosts = allPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(sortedPosts);
  }, []);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    if (!account) {
      alert('Please connect your wallet to vote');
      return;
    }
    
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          const votes = { ...post.votes };
          const oppositeType = voteType === 'up' ? 'down' : 'up';
          
          if (votes[voteType].includes(account)) {
            votes[voteType] = votes[voteType].filter(addr => addr !== account);
          } else {
            votes[voteType] = [...votes[voteType], account];
            votes[oppositeType] = votes[oppositeType].filter(addr => addr !== account);
          }
          
          const updatedPost = { ...post, votes };
          // Save the updated post to localStorage
          const updatedPosts = getPosts().map(p => p.id === postId ? updatedPost : p);
          localStorage.setItem('hashdit_posts', JSON.stringify(updatedPosts));
          
          return updatedPost;
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    if (!account) {
      alert('Please connect your wallet to comment');
      return;
    }
    if (!commentText.trim()) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          text: commentText.trim(),
          authorAddress: account,
          createdAt: new Date().toISOString(),
          authorName: userProfile?.username || 'Anonymous'
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    localStorage.setItem('hashdit_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    setCommentText('');
  };

  const handleShare = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href
        });
      } else {
        const shareUrl = `${window.location.origin}/posts/${post.id}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderMedia = (media: { url: string; type: string }) => {
    if (!media.url) return null;

    return media.type === 'image' ? (
      <img
        src={media.url}
        alt="Post content"
        className="w-full h-full object-cover rounded-lg"
      />
    ) : (
      <video
        src={media.url}
        controls
        className="w-full h-full object-cover rounded-lg"
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8"
        >
          Latest Posts
        </motion.h1>
        
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gradient-to-br from-purple-900/30 to-black/30 rounded-xl border border-white/10"
          >
            <p className="text-gray-400 text-lg">No posts yet. Be the first to create one!</p>
          </motion.div>
        ) : (
          posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/30 via-black/50 to-pink-900/20 rounded-xl 
                border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all 
                shadow-xl hover:shadow-purple-500/10"
            >
              <div className="p-6 space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 
                    flex items-center justify-center text-white font-bold text-lg border-2 border-white/10">
                    {getUserProfile(post.authorAddress)?.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">
                        Posted by {getUserProfile(post.authorAddress)?.username || 'Anonymous'}
                      </span>
                      {post.community && (
                        <>
                          <span className="text-gray-500">•</span>
                          <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                            {post.community}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media Content */}
                {post.media && post.media.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {post.media.map((media, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative aspect-video bg-black/40 rounded-lg overflow-hidden
                          border border-white/10 hover:border-purple-500/30 transition-all"
                      >
                        {renderMedia(media)}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Post Content */}
                <div className="text-gray-300 leading-relaxed">
                  {post.content}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-purple-500/10 text-purple-300 
                        rounded-full text-sm hover:bg-purple-500/20 transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(post.id, 'up')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                      post.votes.up.includes(account || '') 
                        ? 'text-green-400 bg-green-500/10' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <ThumbsUp size={18} />
                    <span>{post.votes.up.length}</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote(post.id, 'down')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                      post.votes.down.includes(account || '') 
                        ? 'text-red-400 bg-red-500/10' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <ThumbsDown size={18} />
                    <span>{post.votes.down.length}</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5"
                  >
                    <MessageCircle size={18} />
                    <span>{post.comments.length}</span>
                    <ArrowDown 
                      size={14} 
                      className={`transition-transform ${expandedPost === post.id ? 'rotate-180' : ''}`}
                    />
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5"
                  >
                    <Share2 size={18} />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-white/10 bg-black/20"
                >
                  <div className="p-4">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white 
                          placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddComment(post.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500"
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                    
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-black/20 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-purple-300 text-sm">{comment.authorName}</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-300">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default AllPosts;

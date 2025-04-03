import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUp, ArrowDown, MessageCircle, Share2, 
  MoreHorizontal, Hash, Send 
} from 'lucide-react';
import { getPosts, updateVote, addComment } from '../utils/postStorage';
import { useWallet } from '../contexts/WalletContext';
import type { Post, Comment } from '../types/post';

interface PostsProps {
  initialPosts?: Post[];
}

export const Posts = ({ initialPosts }: PostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeComment, setActiveComment] = useState<string>('');
  const { account } = useWallet();
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
    } else {
      const fetchedPosts = getPosts().map(post => ({
        ...post,
        votes: post.votes || { up: [], down: [] },
        comments: post.comments || []
      }));
      setPosts(fetchedPosts);
    }
    
    const handleStorageChange = () => {
      const updatedPosts = getPosts().map(post => ({
        ...post,
        votes: post.votes || { up: [], down: [] },
        comments: post.comments || []
      }));
      setPosts(updatedPosts);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initialPosts]);

  const getVoteTotal = (votes: { up: string[], down: string[] }) => {
    const upCount = votes?.up?.length || 0;
    const downCount = votes?.down?.length || 0;
    return upCount - downCount;
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    if (!account) {
      alert('Please connect your wallet to vote');
      return;
    }
    
    updateVote(postId, account, voteType);
    const updatedPosts = getPosts().map(post => ({
      ...post,
      votes: post.votes || { up: [], down: [] },
      comments: post.comments || []
    }));
    setPosts(updatedPosts);
  };

  const handleComment = (postId: string) => {
    if (!account) {
      alert('Please connect your wallet to comment');
      return;
    }
    
    if (!activeComment.trim()) return;
    
    addComment(postId, {
      content: activeComment,
      authorAddress: account
    });
    
    setActiveComment('');
    setPosts(getPosts().map(post => ({
      ...post,
      votes: post.votes || { up: [], down: [] },
      comments: post.comments || []
    }))); // Refresh posts
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10 bg-black">
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black rounded-xl p-6 border border-purple-500/20 shadow-xl"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 
                  flex items-center justify-center text-white font-bold border-2 border-purple-500/20">
                  {post.authorProfilePic ? (
                    <img 
                      src={post.authorProfilePic} 
                      alt={post.authorName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{post.authorName?.[0]?.toUpperCase() || 'A'}</span>
                  )}
                </div>
                <div>
                  <div className="text-purple-400 font-medium">{post.authorName}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {post.community && (
                  <div className="ml-2 px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-sm">
                    {post.community}
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <h2 className="text-xl font-bold text-white mb-3 hover:text-purple-300 
              transition-colors cursor-pointer">{post.title}</h2>
            <div className="text-gray-200 mb-4 leading-relaxed">{post.content}</div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 bg-purple-500/20 
                    text-purple-300 px-2 py-1 rounded-lg text-sm">
                    <Hash size={14} />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Media */}
            {post.media && post.media.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {post.media.map((media, index) => (
                  <div key={index} className="rounded-lg overflow-hidden bg-black/40">
                    {media.type === 'image' ? (
                      <img src={media.url} alt="" className="w-full h-auto" />
                    ) : (
                      <video src={media.url} controls className="w-full h-auto" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Vote and Actions */}
            <div className="flex items-center justify-between mt-6 border-t border-purple-500/10 pt-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-black rounded-xl p-1.5 shadow-2xl border border-purple-500/10">
                  <button 
                    onClick={() => handleVote(post.id, 'up')}
                    className={`group flex items-center px-3 py-2 rounded-lg transition-all 
                      transform hover:scale-105 active:scale-95 ${
                      post.votes?.up?.includes(account || '') 
                        ? 'text-purple-400 bg-purple-500/10' 
                        : 'text-gray-400 hover:bg-purple-500/10 hover:text-purple-400'
                    }`}
                  >
                    <div className="relative transform transition-transform group-hover:-translate-y-1">
                      <ArrowUp className="w-6 h-6 transform" style={{ filter: 'drop-shadow(0 2px 4px rgba(147, 51, 234, 0.5))' }} />
                      <div className="absolute inset-0 blur-sm opacity-50 group-hover:opacity-75">
                        <ArrowUp className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </button>

                  <span className={`px-3 font-bold text-lg ${
                    getVoteTotal(post.votes) > 0 ? 'text-purple-400' :
                    getVoteTotal(post.votes) < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {getVoteTotal(post.votes)}
                  </span>

                  <button 
                    onClick={() => handleVote(post.id, 'down')}
                    className={`group flex items-center px-3 py-2 rounded-lg transition-all 
                      transform hover:scale-105 active:scale-95 ${
                      post.votes?.down?.includes(account || '') 
                        ? 'text-red-400 bg-red-500/10' 
                        : 'text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                    }`}
                  >
                    <div className="relative transform transition-transform group-hover:translate-y-1">
                      <ArrowDown className="w-6 h-6 transform" style={{ filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.5))' }} />
                      <div className="absolute inset-0 blur-sm opacity-50 group-hover:opacity-75">
                        <ArrowDown className="w-6 h-6 text-red-500" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Comment Button with 3D effect */}
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-black border border-purple-500/10
                    shadow-lg hover:shadow-purple-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="relative">
                    <MessageCircle className="w-6 h-6 transform transition-transform group-hover:-translate-y-0.5" 
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(147, 51, 234, 0.5))' }} />
                    <div className="absolute inset-0 blur-sm opacity-50 group-hover:opacity-75">
                      <MessageCircle className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                  <span className="text-lg font-medium text-gray-300">{post.comments?.length || 0}</span>
                </button>

                <button 
                  onClick={() => handleShare(post.id)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 
                    transition-colors"
                >
                  <Share2 size={20} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {expandedComments[post.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 border-t border-white/5 pt-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={activeComment}
                    onChange={(e) => setActiveComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-black rounded-lg px-4 py-2 text-white border 
                      border-white/10 focus:border-purple-500 focus:ring-1 
                      focus:ring-purple-500 transition-all"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 
                      transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {(post.comments || []).map((comment) => (
                    <div key={comment.id} className="bg-black/40 rounded-lg p-4 
                      hover:bg-black/60 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br 
                          from-purple-600 to-pink-600 flex items-center justify-center 
                          text-white text-xs font-bold">
                          {comment.authorName?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span className="text-purple-400 text-sm font-medium">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm ml-8">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Posts;

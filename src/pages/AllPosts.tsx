import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Search,
  TrendingUp,
  Rocket,
  Flame,
  Star,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
  UserCircle,
  Home,
  Circle,
  Clock,
  Info
} from 'lucide-react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import FireIcon from '../components/FireIcon';
import { CreateContent } from '../pages/CreateContent';
import { Footer } from '../components/Footer';

interface Comment {
  id: string;
  text: string;
  authorAddress: string;
  createdAt: string;
  authorName: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  createdAt: string;
  votes: { up: string[]; down: string[] };
  comments: Comment[];
  tags: string[];
  community?: string;
  media?: { url: string; type: string }[];
}

const AllPosts = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  
  useEffect(() => {
    document.title = 'Hashdit';  // Add this line to update page title
  }, []);

  const [posts, setPosts] = useState<Post[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const userProfile = getUserProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const communities = [
    { name: 'Web3', members: '124.5k', icon: '🌐' },
    { name: 'DeFi', members: '89.2k', icon: '💰' },
    { name: 'NFTs', members: '56.3k', icon: '🎨' },
    { name: 'Gaming', members: '234.1k', icon: '🎮' },
    { name: 'Metaverse', members: '45.2k', icon: '🌍' },
  ];

  const filters = [
    { icon: Home, label: 'Home' },
    { icon: TrendingUp, label: 'All' },
    { icon: Plus, label: 'New' },
    { icon: Rocket, label: 'Rising' },
  ];

  const initializeMockPosts = (): Post[] => [
    {
      id: '1',
      title: 'The Future of Web3 Gaming: A Deep Dive',
      content: `Gaming is being revolutionized by blockchain technology. Here's what we're seeing:\n\n🎮 Play-to-earn mechanics\n🌐 True ownership of in-game assets\n💰 Interoperable items across games`,
      authorAddress: account || '',
      createdAt: new Date().toISOString(),
      votes: { up: [], down: [] },
      comments: [
        {
          id: 'c1',
          text: 'This is really exciting!',
          authorAddress: account || '',
          createdAt: new Date().toISOString(),
          authorName: 'Web3Gamer'
        }
      ],
      tags: ['gaming', 'web3', 'blockchain'],
      community: 'Gaming'
    },
    {
      id: '2',
      title: 'DeFi Strategies Explained',
      content: 'Introduction to DeFi yield farming strategies and best practices for maximizing returns while managing risk. Learn about liquidity pools, staking, and more.',
      authorAddress: account || '',
      createdAt: new Date().toISOString(),
      votes: { up: [], down: [] },
      comments: [],
      tags: ['defi', 'crypto', 'yield'],
      community: 'DeFi'
    },
    {
      id: '3',
      title: 'NFT Market Analysis Q1 2024',
      content: 'A comprehensive look at NFT market trends, top collections, and emerging platforms. Data shows increasing institutional interest and mainstream adoption.',
      authorAddress: account || '',
      createdAt: new Date().toISOString(),
      votes: { up: [], down: [] },
      comments: [],
      tags: ['nft', 'market', 'analysis'],
      community: 'NFTs'
    },
    {
      id: '4',
      title: 'Zero Knowledge Proofs Simplified',
      content: 'Understanding ZK-proofs and their applications in blockchain privacy. From theory to practical use cases in DeFi and identity verification.',
      authorAddress: account || '',
      createdAt: new Date().toISOString(),
      votes: { up: [], down: [] },
      comments: [],
      tags: ['privacy', 'technology', 'blockchain'],
      community: 'Web3'
    },
    {
      id: '5',
      title: 'Building DAOs: Best Practices',
      content: 'Essential guide to creating and managing successful DAOs. Governance models, token economics, and community engagement strategies explained.',
      authorAddress: account || '',
      createdAt: new Date().toISOString(),
      votes: { up: [], down: [] },
      comments: [],
      tags: ['dao', 'governance', 'community'],
      community: 'DAOs'
    }
  ];

  useEffect(() => {
    document.title = 'Hashdit';
    
    // Load posts on mount
    try {
      let storedPosts = getPosts();
      // If no posts exist or less than 5 posts, initialize with mock data
      if (!storedPosts || storedPosts.length < 5) {
        storedPosts = initializeMockPosts();
        // Save mock posts to storage
        localStorage.setItem('hashdit_posts', JSON.stringify(storedPosts));
      }
      setPosts(storedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      const mockPosts = initializeMockPosts();
      setPosts(mockPosts);
      // Save mock posts on error
      localStorage.setItem('hashdit_posts', JSON.stringify(mockPosts));
    }
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

  const renderProfileImage = () => {
    // Get profile either from current user or from stored data
    const profile = getUserProfile(account) || getUserProfile();
    if (profile?.avatar) {
      return (
        <div className="w-full h-full rounded-full overflow-hidden">
          <img 
            src={profile.avatar}
            alt={profile.username || 'Profile'}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        {profile?.username?.[0]?.toUpperCase() || <User size={16} />}
      </div>
    );
  };

  const ProfileMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-14 w-48 py-2 bg-black/90 backdrop-blur-xl 
        border border-white/10 rounded-lg shadow-xl"
    >
      <button 
        onClick={() => navigate('/profile')}
        className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5"
      >
        <UserCircle size={16} />
        <span>View Profile</span>
      </button>
      <button 
        onClick={() => navigate('/profile/edit')}
        className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5"
      >
        <Settings size={16} />
        <span>Edit Profile</span>
      </button>
      <button 
        onClick={() => navigate('/posts')}
        className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-white/5"
      >
        <UserCircle size={16} />
        <span>Home</span>
      </button>
      <div className="border-t border-white/10 my-1" />
      <button 
        onClick={handleDisconnect}
        className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/5"
      >
        <LogOut size={16} />
        <span>Disconnect</span>
      </button>
    </motion.div>
  );

  const handleDisconnect = () => {
    // Only remove wallet connection data, keep profile data
    localStorage.removeItem('lastConnectedAccount');
    
    // Don't clear userProfile data
    window.location.href = '/';
  };

  const HeaderUserProfile = () => (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 
          flex items-center justify-center text-white font-bold border border-white/10 overflow-hidden"
        >
          {renderProfileImage()}
        </div>
        <span className="hidden sm:block text-gray-300">
          {userProfile?.username || 'Anonymous'}
        </span>
      </motion.div>

      <AnimatePresence>
        {isProfileMenuOpen && <ProfileMenu />}
      </AnimatePresence>
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileMenuOpen && !(e.target as Element).closest('.relative')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen]);

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query)) ||
      post.community?.toLowerCase().includes(query)
    );
  });

  const SearchBar = () => (
    <div className="flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search posts, tags, communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white 
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex flex-1">  
        {/* Left Sidebar */}
        <div className={`${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        } fixed left-0 top-16 bottom-0 transition-all duration-300 hidden lg:block`}>
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 bg-black">
            <div className="p-4 space-y-4">
              {/* Collapse Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 
                  hover:bg-purple-600/30 rounded-lg text-purple-300 transition-colors w-full"
              >
                {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                {!isSidebarCollapsed && <span>Collapse Menu</span>}
              </motion.button>

              {/* Navigation Items */}
              <div className={`space-y-4 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                <div className="bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                  <div className="space-y-2">
                    {filters.map((filter) => (
                      <motion.button
                        key={filter.label}
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg 
                          text-gray-300 hover:text-white transition-all`}
                      >
                        <filter.icon className="w-5 h-5" />
                        <span>{filter.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Communities Section */}
                <div className="bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                  <h2 className="text-lg font-semibold text-white mb-4">Top Communities</h2>
                  <div className="space-y-2">
                    {communities.map((community) => (
                      <motion.button
                        key={community.name}
                        whileHover={{ scale: 1.02 }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg 
                          text-gray-300 hover:text-white transition-colors"
                      >
                        <span className="text-2xl">{community.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium">r/{community.name}</div>
                          <div className="text-xs text-gray-500">{community.members} members</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* About Us Button */}
                <div className="bg-black/50 backdrop-blur-xl rounded-lg border border-white/10 p-4">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/posts')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg 
                      text-gray-300 hover:text-white transition-all"
                  >
                    <Info size={20} />
                    <span>About Us</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        } pt-16 flex flex-col min-h-screen`}>
          <div className="max-w-[95rem] mx-auto px-4 py-8 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6">
              {/* Main Feed */}
              <div className="max-w-3xl w-full mx-auto">
                {/* Posts List */}
                <div className="space-y-4">
                  {filteredPosts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-gradient-to-br from-purple-900/30 to-black/30 rounded-xl border border-white/10"
                    >
                      <p className="text-gray-400 text-lg">No posts found matching your search.</p>
                    </motion.div>
                  ) : (
                    filteredPosts.map(post => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 1, y: 0 }} // Changed from opacity: 0
                        whileHover={{ y: -2, scale: 1.002 }}
                        className="bg-gradient-to-br from-purple-900/20 via-black/60 to-pink-900/20 rounded-xl 
                          border border-white/10 overflow-hidden transition-all duration-200
                          hover:border-purple-500/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]
                          backdrop-blur-sm"
                      >
                        <div className="p-6 space-y-4 relative bg-opacity-100">
                          {/* Author Info */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 
                              p-[2px] hover:p-[1px] transition-all duration-300">
                              <div className="w-full h-full rounded-xl bg-black flex items-center justify-center overflow-hidden">
                                {renderProfileImage()}
                              </div>
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
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50 rounded-xl" />
                            <div className="text-gray-300 leading-relaxed">
                              {post.content}
                            </div>
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4">
                              {post.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="px-3 py-1 bg-purple-500/10 text-purple-300 
                                    rounded-full text-sm border border-purple-500/20 hover:bg-purple-500/20 
                                    hover:border-purple-500/30 transition-all cursor-pointer backdrop-blur-sm"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="space-y-4">
                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                {post.authorProfilePic ? (
                                  <img
                                    src={post.authorProfilePic}
                                    alt={post.authorName}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <UserCircle className="w-6 h-6 text-purple-300" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-white">{post.authorName}</div>
                                <div className="text-sm text-gray-400">
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-6 pt-4 mt-4 border-t border-white/5">
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
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-80 hidden lg:block">
                {/* About Community */}
                <div className="bg-gradient-to-br from-purple-900/20 via-black/60 to-pink-900/20 
                  rounded-xl border border-white/10 p-6 sticky top-20
                  hover:border-purple-500/30 transition-all duration-300
                  backdrop-blur-sm shadow-[0_0_30px_-15px_rgba(168,85,247,0.2)]">
                  <h2 className="text-lg font-semibold mb-4">Community</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    A decentralized community platform. Connect and share with others.
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <div>
                      <div className="font-medium text-white">12.5k</div>
                      <div>Members</div>
                    </div>
                    <div>
                      <div className="font-medium text-white">180</div>
                      <div>Online</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Replace the old footer with the Footer component */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AllPosts;

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

  const handlePostDeleted = () => {
    const updatedPosts = getPosts();
    setPosts(updatedPosts);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10 bg-black">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default Posts;

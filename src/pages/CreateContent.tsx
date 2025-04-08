import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Film, FileText, Link2, Loader, Hash, ArrowLeft, X } from 'lucide-react';
import type { ContentType } from '../types/database.types';
import { useNavigate, useLocation } from 'react-router-dom';
import { savePost } from '../utils/postStorage';
import { getUserProfile } from '../utils/userService';
import { useWallet } from '../contexts/WalletContext';

interface CreateContentProps {
  onClose?: () => void;
}

export const CreateContent: React.FC<CreateContentProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [content, setContent] = useState({
    title: '',
    description: '',
    contentType: 'text' as ContentType,
    file: null as File | null,
    community: ''
  });

  useEffect(() => {
    const checkProfile = async () => {
      if (!account) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const profile = await getUserProfile(account);
        if (!profile) {
          navigate('/setup', { replace: true });
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking profile:', error);
        alert('Failed to load profile. Please try again.');
        navigate('/', { replace: true });
      }
    };

    // Re-run check when location state changes
    checkProfile();
  }, [account, navigate, location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white flex items-center gap-2">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContent(prev => ({
        ...prev,
        file,
        contentType: file.type.startsWith('image/') ? 'image' : 'video'
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet');
      return;
    }

    try {
      setUploading(true);
      const userProfile = await getUserProfile(account);
      
      if (!userProfile) {
        navigate('/setup');
        return;
      }

      const postData = {
        title: content.title,
        content: content.description,
        type: content.contentType,
        authorAddress: account,
        authorName: userProfile.username,
        authorProfilePic: userProfile.avatar,
        tags,
        community: content.community,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: { up: [], down: [] },
        comments: []
      };

      await savePost(postData);
      navigate('/posts');
    } catch (error: any) {
      console.error('Error creating post:', error);
      alert('Failed to create post: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const contentTypes = [
    { type: 'text', icon: FileText, label: 'Text' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'video', icon: Film, label: 'Video' },
    { type: 'link', icon: Link2, label: 'Link' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Create New Content</h1>
          {onClose ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex items-center gap-2 text-white/70 hover:text-white"
            >
              <X size={20} />
              <span>Close</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </motion.button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input with character count */}
          <div className="relative">
            <label className="block text-white mb-2 font-medium">Title</label>
            <input
              type="text"
              value={content.title}
              onChange={e => setContent(prev => ({ ...prev, title: e.target.value }))}
              maxLength={100}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="Enter a title for your content"
              required
            />
            <span className="absolute right-2 bottom-2 text-xs text-gray-400">
              {content.title.length}/100
            </span>
          </div>

          {/* Content Type Selection with improved styling */}
          <div>
            <label className="block text-white mb-2 font-medium">Content Type</label>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map(({ type, icon: Icon, label }) => (
                <motion.button
                  key={type}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setContent(prev => ({ ...prev, contentType: type as ContentType }))}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border backdrop-blur-sm
                    transition-all duration-200 ${
                    content.contentType === type
                      ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Community Input */}
          <div>
            <label className="block text-white mb-2 font-medium">Community (Optional)</label>
            <input
              type="text"
              value={content.community}
              onChange={e => setContent(prev => ({ ...prev, community: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              placeholder="Enter community name"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-white mb-2 font-medium">Tags (Max 5)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full 
                    text-purple-300 text-sm border border-purple-500/30"
                >
                  <Hash size={14} />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-purple-200"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
            <input
              type="text"
              value={currentTag}
              onChange={e => setCurrentTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
              disabled={tags.length >= 5}
            />
          </div>

          {/* File Upload Area */}
          {(content.contentType === 'image' || content.contentType === 'video') && (
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept={content.contentType === 'image' ? 'image/*' : 'video/*'}
                className="hidden"
              />
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5"
              >
                {previewUrl ? (
                  content.contentType === 'image' ? (
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <video src={previewUrl} controls className="max-h-48 mx-auto rounded-lg" />
                  )
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-10 h-10 text-white/50 mx-auto" />
                    <p className="text-white/70 text-sm">Click to upload {content.contentType}</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {/* Description/Content Input with character count */}
          <div className="relative">
            <label className="block text-white mb-2 font-medium">Description</label>
            <textarea
              value={content.description}
              onChange={e => setContent(prev => ({ ...prev, description: e.target.value }))}
              maxLength={2000}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white 
                min-h-[150px] focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 
                transition-all resize-none"
              placeholder="Enter your content or description"
              required
            />
            <span className="absolute right-2 bottom-2 text-xs text-gray-400">
              {content.description.length}/2000
            </span>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={uploading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-xl text-white font-medium shadow-xl ${
              uploading
                ? 'bg-purple-500/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
            }`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creating Post...</span>
              </div>
            ) : (
              'Create Post'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default CreateContent;

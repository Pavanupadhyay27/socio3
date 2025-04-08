import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Link2, Text, X, Upload, Hash, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

type PostType = 'text' | 'media' | 'link';

export const CreatePost = () => {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const [link, setLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    
    setIsSubmitting(true);
    try {
      // Handle submission logic here
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Create a Post</h1>
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Type Tabs */}
            <div className="flex gap-2 border-b border-white/10">
              {[
                { type: 'text', icon: Text, label: 'Post' },
                { type: 'media', icon: Image, label: 'Image & Video' },
                { type: 'link', icon: Link2, label: 'Link' }
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveTab(type as PostType)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === type
                      ? 'text-purple-500 border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {/* Title Input */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
              required
            />

            {/* Dynamic Content Section */}
            <div className="min-h-[200px]">
              {activeTab === 'text' && (
                <textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white resize-none"
                />
              )}

              {activeTab === 'media' && (
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-white mb-2">Drag and drop files or</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Browse Files
                  </button>
                </div>
              )}

              {activeTab === 'link' && (
                <input
                  type="url"
                  placeholder="Enter URL"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
                />
              )}
            </div>

            {/* Tags Input */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg">
                  <Hash size={14} />
                  <span>{tag}</span>
                  <button type="button" onClick={() => setTags(tags.filter((_, i) => i !== index))}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && currentTag.trim()) {
                    e.preventDefault();
                    setTags([...tags, currentTag.trim()]);
                    setCurrentTag('');
                  }
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium
                hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Creating Post...</span>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

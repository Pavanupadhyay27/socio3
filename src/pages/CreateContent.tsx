import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, Image, Film, FileText, Hash, X, Link2, Eye, 
  Bold, Italic, ChevronDown, BarChart2, AlertTriangle, 
  AlertCircle, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { savePost } from '../utils/postStorage';
import { useWallet } from '../contexts/WalletContext';

export const CreateContent: React.FC = () => {
  const navigate = useNavigate();
  const { account, userProfile } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('text');
  const [content, setContent] = useState({
    title: '',
    description: '',
    contentType: 'text',
    file: null as File | null,
    community: ''
  });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [isNsfw, setIsNsfw] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [draftSaved, setDraftSaved] = useState(false);

  const communities = [
    'Web3', 'DeFi', 'NFTs', 'Gaming', 'Crypto', 'Technology'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && (
      (activeTab === 'image' && file.type.startsWith('image/')) ||
      (activeTab === 'video' && file.type.startsWith('video/'))
    )) {
      setContent(prev => ({ ...prev, file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const saveDraft = () => {
    localStorage.setItem('post_draft', JSON.stringify({
      content,
      tags,
      selectedCommunity,
      isNsfw,
      isSpoiler,
      pollOptions
    }));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const formatText = (format: 'bold' | 'italic' | 'link') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.description.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
    }
    
    setContent(prev => ({
      ...prev,
      description: content.description.substring(0, start) + 
                  formattedText + 
                  content.description.substring(end)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.title || !content.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      const postData = {
        id: `post_${Date.now()}`,
        title: content.title,
        content: content.description,
        authorAddress: account || 'anonymous',
        authorName: userProfile?.username || 'Anonymous',
        authorProfilePic: userProfile?.avatar,
        tags,
        community: content.community,
        createdAt: new Date().toISOString(),
        votes: { up: [], down: [] },
        comments: [],
        media: previewUrl ? [{ url: previewUrl, type: content.contentType }] : []
      };

      await savePost(postData);
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Create a Post</h1>
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Post Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Community Selection */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 
                  border border-white/10 rounded-xl text-white"
              >
                {selectedCommunity || 'Choose a community'}
                <ChevronDown size={20} />
              </button>
              
              {showCommunityDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-black border border-white/10 
                  rounded-xl shadow-xl">
                  {communities.map(community => (
                    <button
                      key={community}
                      type="button"
                      onClick={() => {
                        setSelectedCommunity(community);
                        setShowCommunityDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/5"
                    >
                      {community}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Post Type Tabs */}
            <div className="flex gap-2 border-b border-white/10">
              {[
                { type: 'text', icon: FileText, label: 'Post' },
                { type: 'image', icon: Image, label: 'Image' },
                { type: 'video', icon: Film, label: 'Video' }
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveTab(type);
                    setContent(prev => ({ ...prev, contentType: type }));
                  }}
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
              value={content.title}
              onChange={e => setContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
              required
            />

            {/* Rich Text Controls */}
            <div className="flex gap-2 p-2 bg-white/5 rounded-lg">
              <button
                type="button"
                onClick={() => formatText('bold')}
                className="p-2 text-white hover:bg-white/10 rounded"
              >
                <Bold size={20} />
              </button>
              <button
                type="button"
                onClick={() => formatText('italic')}
                className="p-2 text-white hover:bg-white/10 rounded"
              >
                <Italic size={20} />
              </button>
              <button
                type="button"
                onClick={() => formatText('link')}
                className="p-2 text-white hover:bg-white/10 rounded"
              >
                <Link2 size={20} />
              </button>
            </div>

            {/* Content Area with Preview Toggle */}
            <div className="relative">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-white 
                    bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <Eye size={16} />
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              </div>

              {isPreview ? (
                <div className="prose prose-invert max-w-none p-4 bg-white/5 rounded-xl">
                  {/* Add markdown rendering here */}
                  {content.description}
                </div>
              ) : (
                <textarea
                  id="content-textarea"
                  value={content.description}
                  onChange={e => setContent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[200px] bg-white/5 border border-white/10 rounded-xl 
                    px-4 py-3 text-white resize-y"
                  placeholder="Text (optional)"
                />
              )}
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 
                    text-purple-300 text-sm rounded-lg">
                    <Hash size={14} />
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && currentTag.trim()) {
                    e.preventDefault();
                    setTags([...tags, currentTag.trim()]);
                    setCurrentTag('');
                  }
                }}
                placeholder="Add up to 5 tags..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                disabled={tags.length >= 5}
              />
            </div>

            {/* Poll Creation */}
            {activeTab === 'text' && (
              <button
                type="button"
                onClick={() => setActiveTab('poll')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-white/5 
                  rounded-lg hover:bg-white/10"
              >
                <BarChart2 size={20} />
                Add Poll
              </button>
            )}

            {activeTab === 'poll' && (
              <div className="space-y-3">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={e => {
                        const newOptions = [...pollOptions];
                        newOptions[index] = e.target.value;
                        setPollOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 
                        rounded-lg text-white"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions(opts => 
                          opts.filter((_, i) => i !== index)
                        )}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="w-full px-4 py-2 text-purple-400 border border-dashed 
                      border-purple-400/50 rounded-lg hover:bg-purple-400/10"
                  >
                    Add Option
                  </button>
                )}
              </div>
            )}

            {/* File Upload Area */}
            {(activeTab === 'image' || activeTab === 'video') && (
              <div 
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : 'video/*'}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setContent(prev => ({ ...prev, file }));
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="relative">
                    {activeTab === 'image' ? (
                      <img src={previewUrl} alt="Preview" className="max-h-96 mx-auto rounded-lg" />
                    ) : (
                      <video src={previewUrl} controls className="max-h-96 mx-auto rounded-lg" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setContent(prev => ({ ...prev, file: null }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-purple-500 mx-auto" />
                    <p className="text-white">Drag and drop files or</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Post Options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={isNsfw}
                  onChange={e => setIsNsfw(e.target.checked)}
                  className="rounded border-white/10 bg-white/5"
                />
                <AlertTriangle size={16} />
                NSFW
              </label>
              
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={isSpoiler}
                  onChange={e => setIsSpoiler(e.target.checked)}
                  className="rounded border-white/10 bg-white/5"
                />
                <AlertCircle size={16} />
                Spoiler
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={saveDraft}
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/5 rounded-lg"
              >
                <Save size={20} />
                {draftSaved ? 'Saved!' : 'Save Draft'}
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-white hover:bg-white/5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

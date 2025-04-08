import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, Link, List, MessageCircle, Bold, Italic, 
  Code, FileText, Hash, PlusCircle 
} from 'lucide-react';
import { formatText } from "./editorUtils";
import { MarkdownPreview } from "./MarkdownPreview";
import { savePost } from "../../utils/postStorage";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from './RichTextEditor';
import { v4 as uuidv4 } from 'uuid';

type PostType = 'text' | 'media' | 'link' | 'poll';
type Community = {
  id: string;
  name: string;
  icon?: string;
};

export function CreatePostForm() {
  const navigate = useNavigate();
  
  const [postType, setPostType] = useState<PostType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [markdownMode, setMarkdownMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [videoUrls, setVideoUrls] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    return () => {
      Object.values(videoUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [videoUrls]);

  const communities: Community[] = [
    { id: '1', name: 'Technology' },
    { id: '2', name: 'Gaming' },
    { id: '3', name: 'Crypto' },
  ];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const mediaFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    // Clear previous URLs
    selectedFiles.forEach((_, index) => {
      if (videoUrls[index]) {
        URL.revokeObjectURL(videoUrls[index]);
      }
    });
    
    const newVideoUrls: { [key: number]: string } = {};
    mediaFiles.forEach((file, index) => {
      if (file.type.startsWith('video/')) {
        const videoBlob = new Blob([file], { type: file.type });
        const videoUrl = URL.createObjectURL(videoBlob);
        newVideoUrls[selectedFiles.length + index] = videoUrl;
      }
    });
    
    setSelectedFiles(prev => [...prev, ...mediaFiles]);
    setVideoUrls(prev => ({ ...prev, ...newVideoUrls }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    if (videoUrls[index]) {
      URL.revokeObjectURL(videoUrls[index]);
      setVideoUrls(prev => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const result = formatText(textarea, format);
    
    setContent(result.text);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(result.cursorPos, result.cursorPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const postData = {
        title,
        content,
        type: 'text',
        tags: selectedTags,
        authorAddress: 'anonymous', // Changed from wallet address
        media: uploadedMedia,
        linkUrl: linkUrl,
        community: selectedCommunity,
        votes: { up: [], down: [] },
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const postId = await savePost(postData);
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const renderMediaUpload = () => (
    <div className="mb-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-white/10 hover:border-purple-500/50'}`}
      >
        <div className="flex flex-col items-center gap-4">
          <Upload className="w-12 h-12 text-purple-400" />
          <div className="text-white">
            <p className="font-medium">Drag and Drop or upload media</p>
            <p className="text-sm text-gray-400">Upload files</p>
          </div>
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
          >
            Select Files
          </button>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg overflow-hidden bg-white/5">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                ) : file.type.startsWith('video/') ? (
                  <video
                    src={videoUrls[index]}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    controlsList="nodownload"
                    crossOrigin="anonymous"
                  />
                ) : null}  
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white 
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLinkUpload = () => (
    <div className="mb-6">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/80 mb-1 block">Link URL *</label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        
        {linkUrl && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-1/2"></div>
              <div className="h-10 bg-white/10 rounded w-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTextEditor = () => (
    <div className="mb-4 space-y-4">
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Write your post content here..."
      />
      
      <div className="flex justify-between items-center text-xs text-gray-400">
        <div>
          {content.length} characters
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </motion.button>
      </div>
      
      {isPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-invert max-w-none p-4 bg-black/40 rounded-lg border border-white/10"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/20 to-black/90 rounded-xl p-6 
          border border-white/10 shadow-2xl backdrop-blur-sm"
      >
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
          from-purple-400 to-pink-500 mb-6">
          Create Post
        </h1>

        <div className="space-y-4">
          <div className="relative">
            <button
              onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 
                border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors"
            >
              <span>{selectedCommunity?.name || "Select a community"}</span>
              <ChevronDown size={18} className="text-purple-400" />
            </button>
            
            {showCommunityDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-black/90 border border-white/10 
                rounded-lg shadow-lg backdrop-blur-sm">
                {communities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => {
                      setSelectedCommunity(community);
                      setShowCommunityDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-white hover:bg-purple-500/20 transition-colors"
                  >
                    {community.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 border-b border-white/10 pb-3">
            {[
              { type: 'text', icon: Bold, label: 'Text' },
              { type: 'media', icon: Image, label: 'Images & Video' },
              { type: 'link', icon: Link2, label: 'Link' },
              { type: 'poll', icon: BarChart3, label: 'Poll' }
            ].map(({ type, icon: Icon, label }) => (
              <motion.button
                key={type}
                onClick={() => setPostType(type as PostType)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  postType === type 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </motion.button>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write an interesting title..."
              maxLength={300}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                transition-all hover:bg-black/60"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/300
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 bg-purple-500/20 text-purple-300 
                    px-2 py-1 rounded-lg text-sm group"
                >
                  <Hash size={14} />
                  <span>{tag}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTags(prev => prev.filter((_, i) => i !== index))}
                    className="text-purple-300 hover:text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                transition-all hover:bg-black/60"
            />
          </div>

          {postType === 'media' ? (
            renderMediaUpload()
          ) : postType === 'link' ? (
            renderLinkUpload()
          ) : postType === 'text' ? (
            renderTextEditor()
          ) : null}

          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 
                border border-white/10 text-sm backdrop-blur-sm transition-colors"
            >
              Save Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white 
                rounded-lg text-sm shadow-lg hover:shadow-purple-500/20 transition-all"
            >
              Publish Post
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

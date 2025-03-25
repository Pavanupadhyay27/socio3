import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Image as ImageIcon, Video, Type, X, Upload } from 'lucide-react';

type PostType = 'text' | 'image' | 'video' | 'link';

interface PostForm {
  title: string;
  content: string;
  type: PostType;
  media?: File[];
  link?: string;
}

export function CreatePost() {
  const [activeTab, setActiveTab] = useState<PostType>('text');
  const [form, setForm] = useState<PostForm>({
    title: '',
    content: '',
    type: 'text'
  });
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (activeTab === 'image') {
        return file.type.startsWith('image/');
      } else if (activeTab === 'video') {
        return file.type.startsWith('video/');
      }
      return false;
    });

    if (validFiles.length > 0) {
      setForm(prev => ({
        ...prev,
        media: validFiles,
        type: activeTab
      }));

      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setForm(prev => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index)
    }));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submission logic here
    console.log('Form submitted:', form);
  };

  const tabs = [
    { type: 'text' as PostType, icon: Type, label: 'Post' },
    { type: 'image' as PostType, icon: ImageIcon, label: 'Image' },
    { type: 'video' as PostType, icon: Video, label: 'Video' },
    { type: 'link' as PostType, icon: Link2, label: 'Link' }
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-gradient-to-br from-purple-900/30 to-pink-900/30 
          backdrop-blur-xl rounded-xl p-6 border border-white/10"
      >
        <h1 className="text-2xl font-bold text-white mb-6">Create a Post</h1>

        {/* Tabs */}
        <div className="flex mb-6 bg-black/20 rounded-lg p-1">
          {tabs.map(tab => (
            <motion.button
              key={tab.type}
              onClick={() => {
                setActiveTab(tab.type);
                setForm(prev => ({ ...prev, type: tab.type }));
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                ${activeTab === tab.type 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white' 
                  : 'text-gray-400 hover:text-white'
                } transition-all duration-200`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-purple-500/50 focus:border-transparent"
              required
            />
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'text' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <textarea
                  placeholder="Text (optional)"
                  value={form.content}
                  onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-lg px-4 py-3
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent resize-none"
                />
              </motion.div>
            )}

            {(activeTab === 'image' || activeTab === 'video') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative"
                onDragEnter={handleDrag}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept={activeTab === 'image' ? 'image/*' : 'video/*'}
                  multiple={true}
                  className="hidden"
                />

                {(!form.media || form.media.length === 0) && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center
                      ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20'}
                      transition-all duration-200 cursor-pointer`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400 mb-2">
                      Drag and drop your {activeTab === 'image' ? 'images' : 'video'} here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      {activeTab === 'image' ? 'PNG, JPG, GIF up to 20MB' : 'MP4, WebM up to 100MB'}
                    </p>
                  </div>
                )}

                {previews.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        {activeTab === 'image' ? (
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={preview}
                            className="w-full h-48 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'link' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <input
                  type="url"
                  placeholder="URL"
                  value={form.link || ''}
                  onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-purple-500/50 focus:border-transparent"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600
              hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold
              transition-all duration-200 transform-gpu"
          >
            Post
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

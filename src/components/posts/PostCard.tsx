import { motion } from 'framer-motion';
import { UserCircle, Hash, Minimize2, Maximize2, Play, Pause, Trash2 } from 'lucide-react';
import { Post } from '../../types/Post';
import { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from '../video/VideoPlayer';
import { deletePost } from '../../utils/postStorage';

interface PostCardProps {
  post: Post;
  onPostDeleted?: () => void;
}

export const PostCard = ({ post, onPostDeleted }: PostCardProps) => {
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaUrls, setMediaUrls] = useState<{ [key: string]: string }>({});
  const mediaRefs = useRef<{ [key: string]: HTMLVideoElement | HTMLImageElement }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Create blob URLs for media
    if (post.media) {
      const urls: { [key: string]: string } = {};
      post.media.forEach((media, index) => {
        if (media.url.startsWith('blob:')) {
          // If it's already a blob URL, store reference
          urls[`${post.id}-${index}`] = media.url;
        } else {
          // Create new blob URL for regular URLs
          const response = fetch(media.url)
            .then(res => res.blob())
            .then(blob => {
              const url = URL.createObjectURL(blob);
              setMediaUrls(prev => ({
                ...prev,
                [`${post.id}-${index}`]: url
              }));
            });
        }
      });
      setMediaUrls(urls);
    }

    // Cleanup function
    return () => {
      Object.values(mediaUrls).forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [post.media]);

  const getMediaUrl = (mediaItem: any, index: number) => {
    const key = `${post.id}-${index}`;
    const url = mediaUrls[key] || mediaItem.url;
    
    // Handle blob URLs
    if (url.startsWith('blob:')) {
      return url;
    }
    
    // Handle regular URLs
    try {
      return new URL(url).toString();
    } catch {
      console.error('Invalid URL:', url);
      return '';
    }
  };

  const togglePlay = (videoId: string) => {
    const video = mediaRefs.current[videoId] as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(prev => ({ ...prev, [videoId]: true }));
      } else {
        video.pause();
        setIsPlaying(prev => ({ ...prev, [videoId]: false }));
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent, videoId: string) => {
    e.preventDefault();
    togglePlay(videoId);
  };

  const handleDelete = async () => {
    const success = deletePost(post.id);
    if (success) {
      onPostDeleted?.();
    }
    setShowDeleteConfirm(false);
  };

  const renderMedia = (media: any, index: number) => {
    if (media.type === 'image') {
      return (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <motion.img
            ref={el => { if (el) mediaRefs.current[`${post.id}-${index}`] = el; }}
            src={getMediaUrl(media, index)}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 
              group-hover:scale-105"
            onClick={() => setIsMediaExpanded(!isMediaExpanded)}
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              // Fallback handling
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.png';
            }}
            style={{ cursor: 'pointer' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />
        </>
      );
    } else if (media.type === 'video') {
      const videoUrl = getMediaUrl(media, index);
      if (!videoUrl) return null;
      
      return (
        <VideoPlayer
          src={videoUrl}
          poster={media.thumbnail || undefined}
        />
      );
    }
    return null;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 p-6 overflow-hidden"
      >
        <div className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 overflow-hidden">
              {post.authorProfilePic ? (
                <img src={post.authorProfilePic} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-6 h-6 text-purple-300" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-white">{post.title}</h3>
              <div className="text-sm text-gray-400">{post.authorName}</div>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-gray-300">{post.content}</p>

          {/* Media Content */}
          {post.media && post.media.length > 0 && (
            <div className="mt-4 space-y-4">
              {post.media.map((media, index) => (
                <motion.div
                  key={index}
                  className={`relative group ${isMediaExpanded ? 'h-auto' : 'max-h-[500px]'} 
                    overflow-hidden rounded-xl border border-white/10 transition-all duration-300
                    hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10`}
                  layoutId={`media-${post.id}-${index}`}
                >
                  {renderMedia(media, index)}

                  {/* Expand/Collapse Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsMediaExpanded(!isMediaExpanded)}
                    className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full
                      border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    {isMediaExpanded ? (
                      <Minimize2 size={18} />
                    ) : (
                      <Maximize2 size={18} />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-xs"
                >
                  <Hash className="inline w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.authorAddress === account && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute top-4 right-4 p-2 bg-red-500/10 rounded-full 
              hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </motion.button>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 border border-red-500/20 p-6 rounded-xl max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Delete Post?</h3>
            <p className="text-gray-400 mb-6">
              This action cannot be undone. This will permanently delete your post.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                  transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

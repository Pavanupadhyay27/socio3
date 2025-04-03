import React from 'react';
import { motion } from 'framer-motion';
import { getPosts } from '../../utils/postStorage';
import { Post } from '../../types/post';
import { MarkdownPreview } from './MarkdownPreview';
import { Hash, MessageCircle, Share2 } from 'lucide-react';

export const PostsList = () => {
  const posts = getPosts();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Recent Posts</h1>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <h2 className="text-xl text-white/80 mb-2">No posts yet</h2>
            <p className="text-gray-400">Check back later for new posts!</p>
          </div>
        ) : (
          posts.map((post: Post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="flex items-center gap-1 text-sm text-purple-300">
                        <Hash size={14} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                {post.type === 'text' && (
                  <div className="prose prose-invert max-w-none">
                    <MarkdownPreview content={post.content} />
                  </div>
                )}
                {post.type === 'media' && post.media && (
                  <div className="grid grid-cols-2 gap-4">
                    {post.media.map((item, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        {item.type === 'image' ? (
                          <img src={item.url} alt="" className="w-full h-auto" />
                        ) : (
                          <video src={item.url} controls className="w-full h-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {post.type === 'link' && (
                  <a 
                    href={post.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 break-all"
                  >
                    {post.linkUrl}
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 hover:text-white">
                    <MessageCircle size={20} />
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-white">
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

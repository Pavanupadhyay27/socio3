import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bold, Italic, Link2, List, Quote, Code, Image, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState({ x: 0, y: 0 });

  const formatOptions = [
    { icon: Bold, label: 'Bold', command: 'bold' },
    { icon: Italic, label: 'Italic', command: 'italic' },
    { icon: Link2, label: 'Link', command: 'createLink' },
    { icon: List, label: 'List', command: 'insertUnorderedList' },
    { icon: Quote, label: 'Quote', command: 'formatBlock', value: 'blockquote' },
    { icon: Code, label: 'Code', command: 'formatBlock', value: 'pre' },
  ];

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionCoords({ x: rect.x, y: rect.y - 40 });
      setShowFormatMenu(true);
    } else {
      setShowFormatMenu(false);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <Smile size={20} />
        </button>
        <button
          onClick={() => document.getElementById('image-upload')?.click()}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <Image size={20} />
        </button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                document.execCommand('insertImage', false, e.target?.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      <div
        contentEditable
        className="min-h-[200px] bg-black/40 border border-white/10 rounded-lg p-4 text-white 
          focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all
          prose prose-invert max-w-none hover:bg-black/60"
        placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerText)}
        onSelect={handleSelectionChange}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      <AnimatePresence>
        {showFormatMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bg-black/90 border border-white/10 rounded-lg shadow-xl p-1 flex gap-1
              backdrop-blur-sm"
            style={{ left: selectionCoords.x, top: selectionCoords.y }}
          >
            {formatOptions.map(({ icon: Icon, label, command, value }) => (
              <button
                key={label}
                onClick={() => handleFormat(command, value)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                title={label}
              >
                <Icon size={16} />
              </button>
            ))}
          </motion.div>
        )}

        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-50 top-12 left-0"
          >
            <EmojiPicker
              onEmojiClick={(emoji) => {
                document.execCommand('insertText', false, emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

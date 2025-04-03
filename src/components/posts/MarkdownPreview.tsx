import React from 'react';
import type { FC } from 'react';

let md: any;

// Dynamically import markdown-it
try {
  const MarkdownIt = require('markdown-it');
  md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });
} catch (error) {
  console.error('Failed to load markdown-it:', error);
}

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ content }) => {
  if (!md) {
    return <div className="text-red-500">Markdown renderer not available</div>;
  }

  const html = md.render(content);

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

import React from 'react';
import type { FC } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

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

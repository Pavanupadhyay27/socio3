export type ContentType = 'text' | 'image' | 'video' | 'link';

export interface ContentData {
  title: string;
  description: string;
  contentType: ContentType;
  media?: { url: string; type: string }[];
  linkUrl?: string;
  tags?: string[];
}

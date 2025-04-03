export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'media' | 'link' | 'poll';
  authorAddress: string;
  authorName?: string;
  authorProfilePic?: string;
  tags: string[];
  media?: { url: string; type: 'image' | 'video' }[];
  linkUrl?: string;
  community?: string;
  createdAt: string;
  updatedAt: string;
  votes: {
    up: string[];
    down: string[];
  };
  comments: Comment[];
  isDraft?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorAddress: string;
  authorName?: string;
  createdAt: string;
  votes: {
    up: string[];
    down: string[];
  };
}

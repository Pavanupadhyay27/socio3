export interface Post {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  authorName: string;
  authorProfilePic?: string;
  createdAt: string;
  tags: string[];
  votes: {
    up: string[];
    down: string[];
  };
  comments: Comment[];
  community?: string;
  media?: Media[];
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorAddress: string;
  createdAt: string;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface UserProfile {
  username: string;
  profession: string;
  bio?: string;
  avatar?: string;
  interests: string[];
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  walletAddress: string;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
}

export interface Votes {
  up: string[];
  down: string[];
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorAddress: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  authorName: string;
  authorProfilePic?: string;
  createdAt: string;
  tags: string[];
  votes: Votes;
  comments: Comment[];
  community?: string;
  media?: Media[];
}

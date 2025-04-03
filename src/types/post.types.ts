export interface PostMetadata {
  id: string;
  title: string;
  content: string;
  authorAddress: string;
  authorProfile: {
    username: string;
    avatar?: string;
  };
  media?: {
    url: string;
    type: string;
  }[];
  votes: {
    up: string[];
    down: string[];
  };
  comments: {
    id: string;
    content: string;
    authorAddress: string;
    authorName: string;
    createdAt: string;
    votes: {
      up: string[];
      down: string[];
    };
  }[];
  tags: string[];
  community?: string;
  createdAt: string;
  updatedAt: string;
}

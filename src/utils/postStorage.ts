export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'media' | 'link' | 'poll';
  tags: string[];
  authorAddress: string;
  media?: { url: string | File; type: string }[];
  linkUrl?: string;
  community?: string;
  votes: { up: string[]; down: string[] };
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

const POSTS_KEY = 'hashdit_posts';

export const savePost = async (post: Omit<Post, 'id'>, isDraft = false): Promise<string> => {
  const posts = getPosts();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Ensure media is properly processed before saving
  const processedPost = {
    ...post,
    id,
    media: post.media?.map(media => ({
      url: media.url,
      type: media.type
    }))
  };

  if (isDraft) {
    localStorage.setItem(`draft_${id}`, JSON.stringify(processedPost));
  } else {
    posts.unshift(processedPost);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  return id;
};

export const getPosts = (): Post[] => {
  try {
    const posts = localStorage.getItem(POSTS_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
};

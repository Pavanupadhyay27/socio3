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

export const clearPosts = () => {
  localStorage.removeItem('hashdit_posts');
};

export const getPosts = (): Post[] => {
  try {
    const posts = localStorage.getItem('hashdit_posts');
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

export const savePost = (post: Post) => {
  try {
    const posts = getPosts();
    posts.unshift(post);
    localStorage.setItem('hashdit_posts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Error saving post:', error);
    return false;
  }
};

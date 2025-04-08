export interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  authorAddress: string;
  authorName: string;
  authorProfilePic?: string;
  tags: string[];
  community?: string;
  createdAt: string;
  updatedAt: string;
  votes: {
    up: string[];
    down: string[];
  };
  comments: {
    id: string;
    text: string;
    authorAddress: string;
    authorName: string;
    createdAt: string;
  }[];
  media?: {
    url: string;
    type: string;
  }[];
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
    return post.id;
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
};

export const deletePost = (postId: string) => {
  try {
    const posts = getPosts();
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

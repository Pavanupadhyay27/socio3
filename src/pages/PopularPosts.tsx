import React, { useState, useEffect } from 'react';
import { getPosts } from '../utils/postStorage';
import { Post } from '../types/post';
import { Posts } from './Posts';

const PopularPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sortedPosts = allPosts.sort((a, b) => {
      // Sort by votes, comments, etc.
      const aScore = (a.votes?.up?.length || 0) - (a.votes?.down?.length || 0) + (a.comments?.length || 0);
      const bScore = (b.votes?.up?.length || 0) - (b.votes?.down?.length || 0) + (b.comments?.length || 0);
      return bScore - aScore;
    });
    setPosts(sortedPosts);
  }, []);

  return <Posts initialPosts={posts} />;
};

export default PopularPosts;

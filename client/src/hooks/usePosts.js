import { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../api/posts';

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsData = await getPosts();
      setPosts(postsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData) => {
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [...prev, newPost]);
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      throw err;
    }
  };

  const removePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost: addPost,
    deletePost: removePost,
    updatePost: async (id, postData) => {
      try {
        const updated = await updatePost(id, postData);
        setPosts(prev => prev.map(post => post.id === id ? updated : post));
        return updated;
      } catch (err) {
        setError('Failed to update post');
        throw err;
      }
    }
  };
};

export default usePosts;
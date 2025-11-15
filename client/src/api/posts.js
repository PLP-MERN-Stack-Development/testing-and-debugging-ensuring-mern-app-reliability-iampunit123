
// API functions for posts
export const getPosts = async () => {
  // Mock implementation - in real app, this would fetch from backend
  return [
    { id: 1, title: 'First Post', content: 'Content 1' },
    { id: 2, title: 'Second Post', content: 'Content 2' }
  ];
};

export const createPost = async (postData) => {
  // Mock implementation
  return { id: Date.now(), ...postData };
};

export const updatePost = async (id, postData) => {
  // Mock implementation
  return { id, ...postData };
};

export const deletePost = async (id) => {
  // Mock implementation
  return { success: true };
};
EOF
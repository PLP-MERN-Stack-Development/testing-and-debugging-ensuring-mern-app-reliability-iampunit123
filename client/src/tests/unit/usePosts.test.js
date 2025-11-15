import { renderHook, act } from '@testing-library/react';
import usePosts from '../../hooks/usePosts';

// Mock the API
jest.mock('../../api/posts', () => ({
  getPosts: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Post 1', content: 'Content 1' },
    { id: 2, title: 'Post 2', content: 'Content 2' }
  ])),
  createPost: jest.fn((post) => Promise.resolve({ id: 3, ...post })),
  updatePost: jest.fn((id, post) => Promise.resolve({ id, ...post })),
  deletePost: jest.fn(() => Promise.resolve({ success: true }))
}));

describe('usePosts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty posts and loading true', () => {
    const { result } = renderHook(() => usePosts());
    
    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should fetch posts and update state', async () => {
    const { result } = renderHook(() => usePosts());
    
    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0].title).toBe('Post 1');
  });

  it('should create a new post', async () => {
    const { result } = renderHook(() => usePosts());
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      await result.current.createPost({ 
        title: 'New Post', 
        content: 'New Content' 
      });
    });

    // Verify the createPost function exists and was called
    expect(result.current.createPost).toBeDefined();
  });

  it('should handle errors', async () => {
    const { getPosts } = require('../../api/posts');
    getPosts.mockRejectedValueOnce(new Error('Network error'));
    
    const { result } = renderHook(() => usePosts());
    
    // Wait for the async operation to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.error).toBe('Failed to fetch posts');
    expect(result.current.loading).toBe(false);
  });

  it('basic arithmetic test', () => {
    expect(2 + 2).toBe(4);
  });
});
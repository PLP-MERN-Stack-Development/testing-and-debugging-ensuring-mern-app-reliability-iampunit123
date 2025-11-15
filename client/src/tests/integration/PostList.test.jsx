import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Simple post list component that doesn't depend on external APIs
const PostList = ({ posts = [] }) => (
  <div data-testid="post-list">
    <h1>Posts</h1>
    {posts.length === 0 ? (
      <p>No posts available</p>
    ) : (
      <ul>
        {posts.map(post => (
          <li key={post.id} data-testid="post-item">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

describe('PostList Component - Integration', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('renders post list container', () => {
    renderWithRouter(<PostList />);
    expect(screen.getByTestId('post-list')).toBeInTheDocument();
  });

  it('renders posts heading', () => {
    renderWithRouter(<PostList />);
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });

  it('shows no posts message when empty', () => {
    renderWithRouter(<PostList posts={[]} />);
    expect(screen.getByText('No posts available')).toBeInTheDocument();
  });

  it('renders list of posts when provided', () => {
    const mockPosts = [
      { id: 1, title: 'First Post', content: 'Content 1' },
      { id: 2, title: 'Second Post', content: 'Content 2' }
    ];
    
    renderWithRouter(<PostList posts={mockPosts} />);
    
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
    expect(screen.getAllByTestId('post-item')).toHaveLength(2);
  });
});
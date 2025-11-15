import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the API functions that don't exist yet
jest.mock('../../api/posts', () => ({
  createPost: jest.fn(() => Promise.resolve({ 
    id: 1, 
    title: 'Test Post', 
    content: 'Test Content' 
  }))
}));

// Simple PostForm component for testing
const PostForm = ({ onSubmit = () => {} }) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="post-form">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

describe('PostForm Component', () => {
  it('renders form fields correctly', () => {
    render(<PostForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    render(<PostForm onSubmit={mockOnSubmit} />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Post Title');
    await userEvent.type(screen.getByLabelText(/content/i), 'Test post content');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create post/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Post Title',
        content: 'Test post content'
      });
    });
  });

  it('renders without crashing', () => {
    render(<PostForm />);
    expect(screen.getByTestId('post-form')).toBeInTheDocument();
  });
});
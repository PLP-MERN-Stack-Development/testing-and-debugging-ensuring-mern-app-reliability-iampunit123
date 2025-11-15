import React from 'react';
import { render, screen } from '@testing-library/react';

const SimpleComponent = () => <div>Hello Test</div>;

test('renders simple component', () => {
  render(<SimpleComponent />);
  expect(screen.getByText('Hello Test')).toBeInTheDocument();
});
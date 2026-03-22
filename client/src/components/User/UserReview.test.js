import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserReview from './UserReview';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockReview = {
  review_id: 1,
  title: 'Great Deal!',
  body: 'This deal was amazing and worth every penny.',
  deal_name: 'Half Off Pizza',
  restaurant_name: 'Pizza Palace',
  username: 'johndoe',
  user_id: 'user-123',
  created_at: '2024-01-15',
  edited_at: '2024-01-15'
};

const mockCallbacks = {
  onDelete: jest.fn(),
  onUpdate: jest.fn()
};

describe('UserReview', () => {

  test('renders review details correctly', () => {
    render(
      <UserReview 
        review={mockReview} 
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    expect(screen.getByText('Great Deal!')).toBeInTheDocument();
    expect(screen.getByText('This deal was amazing and worth every penny.')).toBeInTheDocument();
    expect(screen.getByText(/Pizza Palace/)).toBeInTheDocument();
    expect(screen.getByText(/Half Off Pizza/)).toBeInTheDocument();
  });



  test('enters edit mode when Edit button is clicked', () => {
    render(
      <UserReview 
        review={mockReview} 
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    expect(screen.getByDisplayValue('Great Deal!')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This deal was amazing and worth every penny.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  test('cancels edit mode when Cancel button is clicked', () => {
    render(
      <UserReview 
        review={mockReview} 
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
  });

  test('shows error when title is empty', async () => {
    render(
      <UserReview 
        review={mockReview} 
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    const titleInput = screen.getByDisplayValue('Great Deal!');
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText(/Title and body are required/i)).toBeInTheDocument();
    });
  });

});

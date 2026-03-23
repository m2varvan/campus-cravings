import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRating from './UserRating';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockRating = {
  ratingID: 'rating-1',
  dealID: 'deal-1',
  dealName: 'Half Off Pizza',
  restaurantName: 'Pizza Palace',
  userTasteRating: 4,
  userValueRating: 5,
  userPortionRating: 3
};

const mockCallbacks = {
  onDelete: jest.fn(),
  onUpdate: jest.fn()
};

describe('UserRating', () => {

  test('renders rating details correctly', () => {
    render(
      <UserRating
        rating={mockRating}
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    expect(screen.getByText(/Half Off Pizza/)).toBeInTheDocument();
    expect(screen.getByText(/Pizza Palace/)).toBeInTheDocument();
    expect(screen.getByText(/My Value Rating/)).toBeInTheDocument();
    expect(screen.getByText(/My Taste Rating/)).toBeInTheDocument();
    expect(screen.getByText(/My Portion Size Rating/)).toBeInTheDocument();
  });

  test('displays edit and delete buttons initially', () => {
    render(
      <UserRating
        rating={mockRating}
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  test('updates rating successfully', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(
      <UserRating
        rating={mockRating}
        uuid="user-123"
        onDelete={mockCallbacks.onDelete}
        onUpdate={mockCallbacks.onUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(screen.getByText(/Rating updated successfully/i)).toBeInTheDocument();
    });
  });
});

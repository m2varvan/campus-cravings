import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Review from './Review';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockReviews = [
  {
    review_id: 1,
    title: 'Great Deal',
    body: 'Loved it',
    username: 'John',
    user_id: '123',
    created_at: '2024-01-01',
    edited_at: '2024-01-01'
  }
];

test('loads and displays reviews on mount', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  render(<Review uuid="123" dealID={1} />);

  const review = await screen.findByText('Great Deal');
  expect(review).toBeTruthy();
});

test('shows login message if not logged in', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  render(<Review uuid={null} dealID={1} />);

  const loginMsg = await screen.findByText('Please log in to submit a review.');
  expect(loginMsg).toBeTruthy();

  const button = screen.getByText('Submit Review');
  expect(button.disabled).toBe(true);
});

test('shows validation error if fields are empty', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  render(<Review uuid="123" dealID={1} />);

  fireEvent.click(screen.getByText('Submit Review'));

  const error = await screen.findByText('Title and body are required.');
  expect(error).toBeTruthy();
});

test('submits review successfully', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        review_id: 2,
        title: 'New Review',
        body: 'Nice',
        username: 'John',
        user_id: '123',
        created_at: '2024-01-02',
        edited_at: '2024-01-02'
      })
    });

  render(<Review uuid="123" dealID={1} />);

  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'New Review' }
  });

  fireEvent.change(screen.getByLabelText('Review'), {
    target: { value: 'Nice' }
  });

  fireEvent.click(screen.getByText('Submit Review'));

  const success = await screen.findByText('Review submitted successfully.');
  expect(success).toBeTruthy();

  const newReview = await screen.findByText('New Review');
  expect(newReview).toBeTruthy();
});

test('handles server error on submit', async () => {
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    .mockRejectedValueOnce(new Error('Server error'));

  render(<Review uuid="123" dealID={1} />);

  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Test' }
  });

  fireEvent.change(screen.getByLabelText('Review'), {
    target: { value: 'Body' }
  });

  fireEvent.click(screen.getByText('Submit Review'));

  const error = await screen.findByText('Server error.');
  expect(error).toBeTruthy();
});
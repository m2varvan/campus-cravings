import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RestaurantReview from './RestaurantReview';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockReviews = Array.from({ length: 6 }, (_, i) => ({
  review_id: i + 1,
  title: `Title ${i + 1}`,
  body: `Body ${i + 1}`,
  deal_name: `Deal ${i + 1}`,
  username: 'User',
  created_at: '2024-01-01',
  edited_at: i === 0 ? '2024-01-02' : '2024-01-01'
}));

test('loads and displays reviews', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  render(<RestaurantReview restaurantID={1} />);

  const title = await screen.findByText('Title 1');
  expect(title).toBeTruthy();

  const editedLabel = screen.getByText('(Edited on 2024-01-02)');
  expect(editedLabel).toBeTruthy();
});

test('shows error if fetch fails', async () => {
  fetch.mockResolvedValueOnce({
    ok: false
  });

  render(<RestaurantReview restaurantID={1} />);

  const error = await screen.findByText('Failed to load reviews.');
  expect(error).toBeTruthy();
});

test('shows no reviews message', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  render(<RestaurantReview restaurantID={1} />);

  const empty = await screen.findByText('No reviews yet.');
  expect(empty).toBeTruthy();
});

test('toggles show more and show less', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  render(<RestaurantReview restaurantID={1} />);

  const showMore = await screen.findByText('Show More');
  expect(showMore).toBeTruthy();

  fireEvent.click(showMore);

  const showLess = screen.getByText('Show Less');
  expect(showLess).toBeTruthy();
});
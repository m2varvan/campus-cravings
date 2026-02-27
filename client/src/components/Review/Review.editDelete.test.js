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
    title: 'Title 1',
    body: 'Body 1',
    username: 'John',
    user_id: '123',
    created_at: '2024-01-01',
    edited_at: '2024-01-01'
  },
  {
    review_id: 2,
    title: 'Title 2',
    body: 'Body 2',
    username: 'Jane',
    user_id: '456',
    created_at: '2024-01-01',
    edited_at: '2024-01-01'
  },
  {
    review_id: 3,
    title: 'Title 3',
    body: 'Body 3',
    username: 'Jane',
    user_id: '456',
    created_at: '2024-01-01',
    edited_at: '2024-01-01'
  },
  {
    review_id: 4,
    title: 'Title 4',
    body: 'Body 4',
    username: 'Jane',
    user_id: '456',
    created_at: '2024-01-01',
    edited_at: '2024-01-01'
  }
];

test('allows user to edit their review', async () => {
  fetch
    // initial fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    })
    // PUT request
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })
    // refresh fetch after save
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    });

  render(<Review uuid="123" dealID={1} />);

  const review = await screen.findByText('Title 1');
  expect(review).toBeTruthy();

  fireEvent.click(screen.getByText('Edit'));

  fireEvent.change(screen.getByLabelText('Edit Title'), {
    target: { value: 'Updated Title' }
  });

  fireEvent.change(screen.getByLabelText('Edit Review'), {
    target: { value: 'Updated Body' }
  });

  fireEvent.click(screen.getByText('Save'));

  const success = await screen.findByText('Review updated successfully.');
  expect(success).toBeTruthy();
});

test('allows user to delete their review', async () => {
  fetch
    // initial fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockReviews
    })
    // delete request
    .mockResolvedValueOnce({
      ok: true
    });

  render(<Review uuid="123" dealID={1} />);

  const review = await screen.findByText('Title 1');
  expect(review).toBeTruthy();

  fireEvent.click(screen.getByText('Delete'));

  await waitFor(() => {
    expect(screen.queryByText('Title 1')).toBeNull();
  });
});

test('toggles show more and show less', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  render(<Review uuid="123" dealID={1} />);

  const showMoreBtn = await screen.findByText('Show More');
  expect(showMoreBtn).toBeTruthy();

  fireEvent.click(showMoreBtn);

  const showLessBtn = screen.getByText('Show Less');
  expect(showLessBtn).toBeTruthy();
});
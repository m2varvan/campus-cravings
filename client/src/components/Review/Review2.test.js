import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Review from './Review';

global.fetch = jest.fn();

const mockReviews = [
  {
    review_id: 1,
    title: 'Great Deal',
    body: 'Really enjoyed this',
    created_at: new Date().toISOString()
  }
];

beforeEach(() => {
  fetch.mockClear();
});

test('fetches and displays reviews on mount', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  render(<Review dealID={1} />);

  expect(fetch).toHaveBeenCalledWith('/api/deal/1/reviews');

  await waitFor(() => {
    expect(screen.getByText('Great Deal')).toBeInTheDocument();
    expect(screen.getByText('Really enjoyed this')).toBeInTheDocument();
  });
});

test('submits a new review', async () => {
  // Initial fetch
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => []
  });

  // POST response
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      review_id: 2,
      title: 'New Review',
      body: 'Nice!',
      created_at: new Date().toISOString()
    })
  });

  render(<Review dealID={1} />);

  fireEvent.change(screen.getByPlaceholderText(/title/i), {
    target: { value: 'New Review' }
  });

  fireEvent.change(screen.getByPlaceholderText(/body/i), {
    target: { value: 'Nice!' }
  });

  fireEvent.click(screen.getByText(/submit/i));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/add/review', expect.any(Object));
  });
});

test('edits a review', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true })
  });

  render(<Review dealID={1} />);

  await waitFor(() => {
    expect(screen.getByText('Great Deal')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/edit/i));

  fireEvent.change(screen.getByDisplayValue('Great Deal'), {
    target: { value: 'Updated Title' }
  });

  fireEvent.click(screen.getByText(/save/i));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      '/api/review/1',
      expect.objectContaining({
        method: 'PUT'
      })
    );
  });
});

test('deletes a review', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockReviews
  });

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true })
  });

  render(<Review dealID={1} />);

  await waitFor(() => {
    expect(screen.getByText('Great Deal')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/delete/i));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(
      '/api/review/1',
      expect.objectContaining({
        method: 'DELETE'
      })
    );
  });
});
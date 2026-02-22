import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Review from './Review';

global.fetch = jest.fn();

describe('Review Component', () => {

  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders "No reviews yet." when empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Review uuid="user-223" dealID={1} />);

    await waitFor(() =>
      expect(screen.getByText('No reviews yet.')).toBeInTheDocument()
    );
  });

  test('renders fetched reviews', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{
        review_id: 1,
        user_id: 'user-223',
        title: 'Great Deal',
        body: 'Loved it',
        created_at_formatted: '2026-02-22 12:00'
      }]
    });

    render(<Review uuid="user-223" dealID={1} />);

    await waitFor(() =>
      expect(screen.getByText('Great Deal')).toBeInTheDocument()
    );

    expect(screen.getByText('Loved it')).toBeInTheDocument();
  });

  test('blocks submission if title empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Review uuid="user-223" dealID={1} />);

    fireEvent.change(screen.getByLabelText('Review'), {
      target: { value: 'Some review text' }
    });

    fireEvent.click(screen.getByText('Submit Review'));

    expect(await screen.findByText('Title and body are required.'))
      .toBeInTheDocument();
  });

  test('blocks submission if logged out', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<Review uuid={null} dealID={1} />);

    fireEvent.click(screen.getByText('Submit Review'));

    expect(await screen.findByText('Please log in to submit a review.'))
      .toBeInTheDocument();
  });

  test('submits valid review and displays it immediately', async () => {
    // First fetch call (initial load)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Second fetch call (submit)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        review_id: 2,
        user_id: 'user-223',
        title: 'Awesome',
        body: 'Amazing deal',
        created_at_formatted: '2026-02-22 12:30'
      })
    });

    render(<Review uuid="user-223" dealID={1} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Awesome' }
    });

    fireEvent.change(screen.getByLabelText('Review'), {
      target: { value: 'Amazing deal' }
    });

    fireEvent.click(screen.getByText('Submit Review'));

    await waitFor(() =>
      expect(screen.getByText('Awesome')).toBeInTheDocument()
    );

    expect(screen.getByText('Amazing deal')).toBeInTheDocument();
  });

});
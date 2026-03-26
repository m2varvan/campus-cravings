import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserReviewList from './UserReviewList';

beforeEach(() => {
  jest.clearAllMocks();
});

const mockReviews = [
  {
    review_id: 1,
    title: 'Great Deal 1',
    body: 'First review body',
    deal_name: 'Pizza Deal',
    restaurant_name: 'Pizza Palace',
    username: 'john',
    user_id: 'user-1',
    created_at: '2024-01-01',
    edited_at: '2024-01-01'
  },
  {
    review_id: 2,
    title: 'Great Deal 2',
    body: 'Second review body',
    deal_name: 'Burger Deal',
    restaurant_name: 'Burger King',
    username: 'jane',
    user_id: 'user-2',
    created_at: '2024-01-02',
    edited_at: '2024-01-02'
  },
  {
    review_id: 3,
    title: 'Great Deal 3',
    body: 'Third review body',
    deal_name: 'Sushi Deal',
    restaurant_name: 'Sushi Palace',
    username: 'bob',
    user_id: 'user-3',
    created_at: '2024-01-03',
    edited_at: '2024-01-03'
  },
  {
    review_id: 4,
    title: 'Great Deal 4',
    body: 'Fourth review body',
    deal_name: 'Salad Deal',
    restaurant_name: 'Salad House',
    username: 'alice',
    user_id: 'user-4',
    created_at: '2024-01-04',
    edited_at: '2024-01-04'
  }
];

describe('UserReviewList', () => {

  test('shows loading state on mount', () => {
    const mockLoadUserReviews = jest.fn(() => new Promise(() => []));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={[]}
      />
    );

    expect(screen.getByText(/Loading reviews/i)).toBeInTheDocument();
  });

  test('loads and displays reviews on mount', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve(mockReviews.slice(0, 3)));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={mockReviews.slice(0, 3)}
      />
    );

    expect(await screen.findByText('Great Deal 1')).toBeInTheDocument();

    expect(mockLoadUserReviews).toHaveBeenCalledWith('user-1');
    expect(mockSetUserReviews).toHaveBeenCalledWith(mockReviews.slice(0, 3));
  });

  test('shows error state when loading fails', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.reject('API error'));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={[]}
      />
    );

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  test('shows empty state when no reviews exist', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve([]));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={[]}
      />
    );

    expect(await screen.findByText(/No reviews submitted/i)).toBeInTheDocument();
  });

  test('displays correct review count', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve(mockReviews.slice(0, 3)));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={mockReviews.slice(0,3)}
      />
    );

    expect(await screen.findByText('(3 reviews)')).toBeInTheDocument();
  });

  test('displays correct singular review count', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve([mockReviews[0]]));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={[mockReviews[0]]}
      />
    );

    expect(await screen.findByText('(1 review)')).toBeInTheDocument();
  });

  test('displays only 3 reviews by default', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve(mockReviews));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={mockReviews}
      />
    );

    expect(await screen.findByText('Great Deal 1')).toBeInTheDocument();
    expect(screen.getByText('Great Deal 2')).toBeInTheDocument();
    expect(screen.getByText('Great Deal 3')).toBeInTheDocument();
    expect(screen.queryByText('Great Deal 4')).not.toBeInTheDocument();
  });

  test('shows Show More button when there are more reviews', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve(mockReviews));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={mockReviews}
      />
    );

    expect(await screen.findByRole('button', { name: /Show More/i })).toBeInTheDocument();
  });

  test('does not show Show More button when showing all reviews', async () => {
    const mockLoadUserReviews = jest.fn(() => Promise.resolve(mockReviews.slice(0, 3)));
    const mockSetUserReviews = jest.fn();

    render(
      <UserReviewList
        uuid="user-1"
        loadUserReviews={mockLoadUserReviews}
        setUserReviews={mockSetUserReviews}
        userReviews={mockReviews.slice(0,3)}
      />
    );

    await screen.findByText('Great Deal 1');

    expect(screen.queryByRole('button', { name: /Show More/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Show Less/i })).not.toBeInTheDocument();
  });

});
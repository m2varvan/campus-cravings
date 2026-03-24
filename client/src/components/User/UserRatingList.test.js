import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRatingList from './UserRatingList';

beforeEach(() => {
  jest.clearAllMocks();
});

const mockRatings = [
  {
    ratingID: 'rating-1',
    dealID: 'deal-1',
    dealName: 'Half Off Pizza',
    restaurantName: 'Pizza Palace',
    userTasteRating: 4,
    userValueRating: 5,
    userPortionRating: 3
  },
  {
    ratingID: 'rating-2',
    dealID: 'deal-2',
    dealName: 'Half Off Burger',
    restaurantName: 'Burger King',
    userTasteRating: 3,
    userValueRating: 4,
    userPortionRating: 4
  },
  {
    ratingID: 'rating-3',
    dealID: 'deal-3',
    dealName: 'Half Off Sushi',
    restaurantName: 'Sushi Palace',
    userTasteRating: 5,
    userValueRating: 3,
    userPortionRating: 5
  },
  {
    ratingID: 'rating-4',
    dealID: 'deal-4',
    dealName: 'Half Off Salad',
    restaurantName: 'Salad House',
    userTasteRating: 2,
    userValueRating: 4,
    userPortionRating: 2
  }
];

describe('UserRatingList', () => {

  test('shows loading state on mount', () => {
    const mockLoadUserRatings = jest.fn(() => new Promise(() => {}));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={[]}
      />
    );

    expect(screen.getByText(/Loading your Ratings/i)).toBeInTheDocument();
  });

  test('loads and displays ratings on mount', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve(mockRatings.slice(0, 3)));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={mockRatings.slice(0,3)}
      />
    );

    expect(await screen.findByText(/Half Off Pizza/i)).toBeInTheDocument();

    expect(mockLoadUserRatings).toHaveBeenCalledWith('user-1');
    expect(mockSetUserRatings).toHaveBeenCalledWith(mockRatings.slice(0, 3));
  });

  test('shows empty state when no ratings exist', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve([]));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={[]}
      />
    );

    expect(await screen.findByText(/No ratings submitted/i)).toBeInTheDocument();
  });

  test('displays correct rating count', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve(mockRatings.slice(0, 3)));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={mockRatings.slice(0,3)}
      />
    );

    expect(await screen.findByText('(3 ratings)')).toBeInTheDocument();
  });

  test('displays correct singular rating count', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve([mockRatings[0]]));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={[mockRatings[0]]}
      />
    );

    expect(await screen.findByText('(1 rating)')).toBeInTheDocument();
  });

  test('displays only 3 ratings by default', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve(mockRatings));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={mockRatings}
      />
    );

    expect(await screen.findByText(/Half Off Pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Half Off Burger/i)).toBeInTheDocument();
    expect(screen.getByText(/Half Off Sushi/i)).toBeInTheDocument();
    expect(screen.queryByText(/Half Off Salad/i)).not.toBeInTheDocument();
  });

  test('shows Show More button when there are more ratings', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve(mockRatings));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={mockRatings}
      />
    );

    expect(await screen.findByRole('button', { name: /Show More/i })).toBeInTheDocument();
  });

  test('does not show Show More button when showing all ratings', async () => {
    const mockLoadUserRatings = jest.fn(() => Promise.resolve(mockRatings.slice(0, 3)));
    const mockSetUserRatings = jest.fn();

    render(
      <UserRatingList
        uuid="user-1"
        loadUserRatings={mockLoadUserRatings}
        setUserRatings={mockSetUserRatings}
        userRatings={mockRatings.slice(0, 3)}
      />
    );

    await screen.findByText(/Half Off Pizza/i);

    expect(screen.queryByRole('button', { name: /Show More/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Show Less/i })).not.toBeInTheDocument();
  });

});
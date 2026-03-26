import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import OwnerRestaurantList from './OwnerRestaurantList';

jest.mock('./OwnerRestaurant', () => ({ restaurant }) => (
    <div data-testid="owner-restaurant">{restaurant.restaurant_name}</div>
));

const mockRestaurants = [
    { restaurant_id: 1, restaurant_name: 'Test Restaurant', avg_rating: 4.3, num_ratings: 20 },
    { restaurant_id: 2, restaurant_name: 'Second Restaurant', avg_rating: 3.8, num_ratings: 10 },
];

const mockLoadOwnerRestaurants = jest.fn(() => Promise.resolve(mockRestaurants));

describe('OwnerRestaurantList Component', () => {

    beforeEach(() => {
        mockLoadOwnerRestaurants.mockClear();
    });

    test('shows loading state initially', () => {
        const neverResolves = jest.fn(() => new Promise(() => {}));
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={neverResolves}
                ownerRestaurants={[]}
                setOwnerRestaurants={jest.fn()}
            />
        );
        expect(screen.getByText(/loading your restaurants/i)).toBeInTheDocument();
    });

    test('renders restaurants after loading', async () => {
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={mockLoadOwnerRestaurants}
                ownerRestaurants={mockRestaurants}
                setOwnerRestaurants={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('owner-restaurant')).toHaveLength(2);
        });
    });

    test('shows correct restaurant count', async () => {
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={mockLoadOwnerRestaurants}
                ownerRestaurants={mockRestaurants}
                setOwnerRestaurants={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/2 restaurants/i)).toBeInTheDocument();
        });
    });

    test('shows singular restaurant when count is 1', async () => {
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={jest.fn(() => Promise.resolve([mockRestaurants[0]]))}
                ownerRestaurants={[mockRestaurants[0]]}
                setOwnerRestaurants={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/1 restaurant\b/i)).toBeInTheDocument();
        });
    });

    test('shows empty state when no restaurants', async () => {
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={jest.fn(() => Promise.resolve([]))}
                ownerRestaurants={[]}
                setOwnerRestaurants={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/no restaurants found/i)).toBeInTheDocument();
        });
    });

    test('shows error message when fetch fails', async () => {
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={jest.fn(() => Promise.reject(new Error('Failed')))}
                ownerRestaurants={[]}
                setOwnerRestaurants={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/an error occurred loading your restaurants/i)).toBeInTheDocument();
        });
    });

    test('renders My Restaurants header', () => {
        render(
            <OwnerRestaurantList
                uuid="test-uuid"
                loadOwnerRestaurants={mockLoadOwnerRestaurants}
                ownerRestaurants={mockRestaurants}
                setOwnerRestaurants={jest.fn()}
            />
        );
        expect(screen.getByText(/my restaurants/i)).toBeInTheDocument();
    });
});
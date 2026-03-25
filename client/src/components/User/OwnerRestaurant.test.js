import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import OwnerRestaurant from './OwnerRestaurant';

jest.mock('../Restaurant/RestaurantDetails', () => ({ open, handleClose }) =>
    open ? <div data-testid="restaurant-details"><button onClick={handleClose}>Close</button></div> : null
);

const mockRestaurant = {
    restaurant_id: 1,
    restaurant_name: 'Test Restaurant',
    avg_rating: 4.3,
    num_ratings: 20,
};

describe('OwnerRestaurant Component', () => {

    beforeEach(() => {
        render(<OwnerRestaurant uuid="test-uuid" restaurant={mockRestaurant} />);
    });

    test('renders restaurant name', () => {
        expect(screen.getByText(/test restaurant/i)).toBeInTheDocument();
    });

    test('renders rating when ratings exist', () => {
        expect(screen.getByText(/⭐/)).toBeInTheDocument();
        expect(screen.getByText(/4.3/)).toBeInTheDocument();
        expect(screen.getByText(/20/)).toBeInTheDocument();
    });

    test('opens RestaurantDetails dialog when clicked', () => {
        fireEvent.click(screen.getByText(/test restaurant/i));
        expect(screen.getByTestId('restaurant-details')).toBeInTheDocument();
    });

    test('closes RestaurantDetails dialog', () => {
        fireEvent.click(screen.getByText(/test restaurant/i));
        fireEvent.click(screen.getByText(/close/i));
        expect(screen.queryByTestId('restaurant-details')).not.toBeInTheDocument();
    });

    test('shows No ratings yet when num_ratings is 0', () => {
        render(<OwnerRestaurant uuid="test-uuid" restaurant={{ ...mockRestaurant, num_ratings: 0 }} />);
        expect(screen.getAllByText(/no ratings yet/i).length).toBeGreaterThan(0);
    });
});
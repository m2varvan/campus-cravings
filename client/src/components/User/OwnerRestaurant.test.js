import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import OwnerRestaurant from './OwnerRestaurant';

jest.mock('../Restaurant/RestaurantDetails', () => ({ open, handleClose }) =>
    open ? <div data-testid="restaurant-details"><button onClick={handleClose}>Close</button></div> : null
);

jest.mock('./EditRestaurantDialog', () => ({ open, handleClose }) =>
    open ? <div data-testid="edit-restaurant-dialog"><button onClick={handleClose}>Close</button></div> : null
);

const mockRestaurant = {
    restaurant_id: 1,
    restaurant_name: 'Test Restaurant',
    avg_rating: 4.3,
    num_ratings: 20,
    street_address: '123 Main St',
    city: 'Waterloo',
    province: 'ON',
    postal_code: 'N2L 3G1',
    phone_number: '519-555-0100',
    website_url: 'https://testrestaurant.com',
    cuisine: 'Italian',
    opening_time: '09:00',
    closing_time: '21:00',
};

describe('OwnerRestaurant Component', () => {

    beforeEach(() => {
        render(
            <OwnerRestaurant
                uuid="test-uuid"
                restaurant={mockRestaurant}
                onRestaurantUpdated={jest.fn()}
            />
        );
    });

    test('renders restaurant name', () => {
        expect(screen.getByText(/test restaurant/i)).toBeInTheDocument();
    });

    test('renders rating when ratings exist', () => {
        expect(screen.getByText(/⭐/)).toBeInTheDocument();
        expect(screen.getByText(/4.3/)).toBeInTheDocument();
        expect(screen.getByText(/20/)).toBeInTheDocument();
    });

    test('shows No ratings yet when num_ratings is 0', () => {
        render(
            <OwnerRestaurant
                uuid="test-uuid"
                restaurant={{ ...mockRestaurant, num_ratings: 0 }}
                onRestaurantUpdated={jest.fn()}
            />
        );
        expect(screen.getAllByText(/no ratings yet/i).length).toBeGreaterThan(0);
    });

    test('opens RestaurantDetails dialog when restaurant name is clicked', () => {
        fireEvent.click(screen.getByText(/test restaurant/i));
        expect(screen.getByTestId('restaurant-details')).toBeInTheDocument();
    });

    test('closes RestaurantDetails dialog', () => {
        fireEvent.click(screen.getByText(/test restaurant/i));
        fireEvent.click(screen.getByText(/close/i));
        expect(screen.queryByTestId('restaurant-details')).not.toBeInTheDocument();
    });

    // Edit button tests
    test('renders Edit button', () => {
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    test('opens EditRestaurantDialog when Edit button is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /edit/i }));
        expect(screen.getByTestId('edit-restaurant-dialog')).toBeInTheDocument();
    });

    test('closes EditRestaurantDialog when close is triggered', () => {
        fireEvent.click(screen.getByRole('button', { name: /edit/i }));
        expect(screen.getByTestId('edit-restaurant-dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/close/i));
        expect(screen.queryByTestId('edit-restaurant-dialog')).not.toBeInTheDocument();
    });

    test('RestaurantDetails and EditRestaurantDialog do not open at the same time by default', () => {
        expect(screen.queryByTestId('restaurant-details')).not.toBeInTheDocument();
        expect(screen.queryByTestId('edit-restaurant-dialog')).not.toBeInTheDocument();
    });
});
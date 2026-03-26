import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import EditRestaurantDialog from './EditRestaurantDialog';

const mockRestaurant = {
    restaurant_id: 1,
    restaurant_name: 'Test Restaurant',
    street_address: '123 Main St',
    unit: 'Unit 4',
    city: 'Waterloo',
    province: 'ON',
    postal_code: 'N2L 3G1',
    phone_number: '519-555-0100',
    website_url: 'https://testrestaurant.com',
    cuisine: 'Italian',
    opening_time: '09:00',
    closing_time: '21:00',
};

const defaultProps = {
    open: true,
    handleClose: jest.fn(),
    restaurant: mockRestaurant,
    onRestaurantUpdated: jest.fn(),
};

describe('EditRestaurantDialog Component', () => {

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Restaurant updated successfully' }) })
        );
        jest.useFakeTimers();
        render(<EditRestaurantDialog {...defaultProps} />);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    test('renders Edit Restaurant Details dialog', () => {
        expect(screen.getByText(/edit restaurant details/i)).toBeInTheDocument();
    });

    // Pre-population tests
    test('pre-populates restaurant name', () => {
        expect(screen.getByLabelText(/restaurant name/i)).toHaveValue('Test Restaurant');
    });

    test('pre-populates street address', () => {
        expect(screen.getByLabelText(/street address/i)).toHaveValue('123 Main St');
    });

    test('pre-populates city', () => {
        expect(screen.getByLabelText(/city/i)).toHaveValue('Waterloo');
    });

    test('pre-populates province', () => {
        expect(screen.getByLabelText(/province/i)).toHaveValue('ON');
    });

    test('pre-populates postal code', () => {
        expect(screen.getByLabelText(/postal code/i)).toHaveValue('N2L 3G1');
    });

    test('pre-populates phone number', () => {
        expect(screen.getByLabelText(/phone number/i)).toHaveValue('519-555-0100');
    });

    test('pre-populates website url', () => {
        expect(screen.getByLabelText(/website url/i)).toHaveValue('https://testrestaurant.com');
    });

    test('pre-populates cuisine', () => {
        expect(screen.getByLabelText(/cuisine/i)).toHaveValue('Italian');
    });

    test('pre-populates opening and closing times', () => {
        expect(screen.getByLabelText(/opening time/i)).toHaveValue('09:00');
        expect(screen.getByLabelText(/closing time/i)).toHaveValue('21:00');
    });

    // Validation tests
    test('shows error when restaurant name is cleared', async () => {
        fireEvent.change(screen.getByLabelText(/restaurant name/i), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(await screen.findByText(/restaurant name is required/i)).toBeInTheDocument();
    });

    test('shows error when street address is cleared', async () => {
        fireEvent.change(screen.getByLabelText(/street address/i), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(await screen.findByText(/street address is required/i)).toBeInTheDocument();
    });

    test('shows error when city is cleared', async () => {
        fireEvent.change(screen.getByLabelText(/city/i), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(await screen.findByText(/city is required/i)).toBeInTheDocument();
    });

    test('shows error when province is cleared', async () => {
        fireEvent.change(screen.getByLabelText(/province/i), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(await screen.findByText(/province is required/i)).toBeInTheDocument();
    });

    test('shows error when postal code is cleared', async () => {
        fireEvent.change(screen.getByLabelText(/postal code/i), { target: { value: '' } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(await screen.findByText(/postal code is required/i)).toBeInTheDocument();
    });

    test('shows error when closing time is before opening time', async () => {
        fireEvent.change(screen.getByLabelText(/opening time/i), { target: { value: '20:00' } });
        fireEvent.change(screen.getByLabelText(/closing time/i), { target: { value: '09:00' } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        expect(await screen.findByText(/closing time must be after opening time/i)).toBeInTheDocument();
    });

    // Success tests
    test('shows success message after successful update', async () => {
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        });
        expect(await screen.findByText(/restaurant updated successfully/i)).toBeInTheDocument();
    });

    test('calls onRestaurantUpdated after successful save', async () => {
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        });
        expect(defaultProps.onRestaurantUpdated).toHaveBeenCalled();
    });

    // Cancel test
    test('calls handleClose when Cancel is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(defaultProps.handleClose).toHaveBeenCalled();
    });
});
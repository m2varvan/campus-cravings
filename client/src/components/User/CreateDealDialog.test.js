import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CreateDealDialog from './CreateDealDialog';

const mockOwnerRestaurants = [
    { restaurant_id: 1, restaurant_name: 'Test Restaurant' },
    { restaurant_id: 2, restaurant_name: 'Second Restaurant' },
];

const defaultProps = {
    open: true,
    handleClose: jest.fn(),
    uuid: 'test-uuid',
    ownerRestaurants: mockOwnerRestaurants,
    onDealCreated: jest.fn(),
};

describe('CreateDealDialog Component', () => {

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Deal created successfully' }) })
        );
        jest.useFakeTimers();
        render(<CreateDealDialog {...defaultProps} />);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    test('renders the dialog with Post a New Deal title', () => {
        expect(screen.getByText(/Post a New Deal/i)).toBeInTheDocument();
    });

    test('renders all required form fields including date fields', () => {
        expect(screen.getByLabelText(/deal title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/valid from/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/valid to/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
    });

    test('shows error when required fields are empty on submit', async () => {
        fireEvent.click(screen.getByRole('button', { name: /post deal/i }));

        expect(await screen.findByText(/deal title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/select at least one day/i)).toBeInTheDocument();
        expect(screen.getByText(/start time is required/i)).toBeInTheDocument();
        expect(screen.getByText(/end time is required/i)).toBeInTheDocument();
    });

    test('shows error for invalid price', async () => {
        fireEvent.change(screen.getByLabelText(/deal title/i), { target: { value: 'Burger' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '-5' } });
        fireEvent.change(screen.getByLabelText(/valid from/i), { target: { value: '2026-04-01' } });
        fireEvent.click(screen.getByLabelText(/mon/i));
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '14:00' } });

        fireEvent.click(screen.getByRole('button', { name: /post deal/i }));

        expect(await screen.findByText(/enter a valid price/i)).toBeInTheDocument();
    });

    test('shows error when end date is before start date', async () => {
        fireEvent.change(screen.getByLabelText(/deal title/i), { target: { value: 'Burger' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '9.99' } });
        fireEvent.change(screen.getByLabelText(/valid from/i), { target: { value: '2026-04-10' } });
        fireEvent.change(screen.getByLabelText(/valid to/i), { target: { value: '2026-04-01' } });
        fireEvent.click(screen.getByLabelText(/mon/i));
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '14:00' } });

        fireEvent.click(screen.getByRole('button', { name: /post deal/i }));

        expect(await screen.findByText(/end date must be after start date/i)).toBeInTheDocument();
    });

    test('shows error when end time is before start time', async () => {
        fireEvent.change(screen.getByLabelText(/deal title/i), { target: { value: 'Burger' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '9.99' } });
        fireEvent.change(screen.getByLabelText(/valid from/i), { target: { value: '2026-04-01' } });
        fireEvent.click(screen.getByLabelText(/mon/i));
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '14:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '10:00' } });

        fireEvent.click(screen.getByRole('button', { name: /post deal/i }));

        expect(await screen.findByText(/end time must be after start time/i)).toBeInTheDocument();
    });

    test('shows success message on successful submission', async () => {
        fireEvent.mouseDown(screen.getByRole('combobox'));
        fireEvent.click(screen.getByText('Test Restaurant'));
        fireEvent.change(screen.getByLabelText(/deal title/i), { target: { value: 'Burger Special' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A great burger deal' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '9.99' } });
        fireEvent.change(screen.getByLabelText(/valid from/i), { target: { value: '2026-04-01' } });
        fireEvent.click(screen.getByLabelText(/mon/i));
        fireEvent.change(screen.getByLabelText(/start time/i), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText(/end time/i), { target: { value: '14:00' } });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /post deal/i }));
        });

        expect(await screen.findByText(/deal posted successfully/i)).toBeInTheDocument();
    });

    test('calls handleClose when Cancel is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(defaultProps.handleClose).toHaveBeenCalled();
    });

    test('allows selecting multiple days', () => {
        fireEvent.click(screen.getByLabelText(/mon/i));
        fireEvent.click(screen.getByLabelText(/tue/i));
        fireEvent.click(screen.getByLabelText(/wed/i));

        expect(screen.getByLabelText(/mon/i)).toBeChecked();
        expect(screen.getByLabelText(/tue/i)).toBeChecked();
        expect(screen.getByLabelText(/wed/i)).toBeChecked();
    });
});
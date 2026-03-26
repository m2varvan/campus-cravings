import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import EditDealDialog from './EditDealDialog';

const mockDeal = {
    dealID: 1,
    dealName: 'Burger Special',
    dealDescription: 'A great burger deal',
    dealPrice: '9.99',
    validFrom: '2026-04-01',
    validTo: '2026-04-30',
    dealDays: ['Monday', 'Tuesday'],
    startTime: '10:00',
    endTime: '14:00',
};

const defaultProps = {
    open: true,
    handleClose: jest.fn(),
    deal: mockDeal,
    onDealUpdated: jest.fn(),
    onDealDeleted: jest.fn(),
};

describe('EditDealDialog Component', () => {

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Deal updated successfully' }) })
        );
        jest.useFakeTimers();
        render(<EditDealDialog {...defaultProps} />);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    test('renders Edit Deal dialog', () => {
        expect(screen.getByText(/edit deal/i)).toBeInTheDocument();
    });

    test('pre-populates form fields with existing deal data', () => {
        expect(screen.getByLabelText(/deal title/i)).toHaveValue('Burger Special');
        expect(screen.getByLabelText(/description/i)).toHaveValue('A great burger deal');
        expect(screen.getByLabelText(/price/i)).toHaveValue(9.99);
        expect(screen.getByLabelText(/valid from/i)).toHaveValue('2026-04-01');
        expect(screen.getByLabelText(/valid to/i)).toHaveValue('2026-04-30');
    });

    test('pre-checks the correct days', () => {
        expect(screen.getByLabelText(/mon/i)).toBeChecked();
        expect(screen.getByLabelText(/tue/i)).toBeChecked();
        expect(screen.getByLabelText(/wed/i)).not.toBeChecked();
    });

    test('allows editing start and end dates', () => {
        const validFrom = screen.getByLabelText(/valid from/i);
        fireEvent.change(validFrom, { target: { value: '2026-05-01' } });
        expect(validFrom).toHaveValue('2026-05-01');

        const validTo = screen.getByLabelText(/valid to/i);
        fireEvent.change(validTo, { target: { value: '2026-05-31' } });
        expect(validTo).toHaveValue('2026-05-31');
    });

    test('shows validation errors when required fields are cleared', async () => {
        fireEvent.change(screen.getByLabelText(/deal title/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/valid from/i), { target: { value: '' } });

        // Uncheck all days
        fireEvent.click(screen.getByLabelText(/mon/i));
        fireEvent.click(screen.getByLabelText(/tue/i));

        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

        expect(await screen.findByText(/deal title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/description is required/i)).toBeInTheDocument();
        expect(screen.getByText(/start date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/select at least one day/i)).toBeInTheDocument();
    });

    test('shows error when end date is before start date', async () => {
        fireEvent.change(screen.getByLabelText(/valid from/i), { target: { value: '2026-04-10' } });
        fireEvent.change(screen.getByLabelText(/valid to/i), { target: { value: '2026-04-01' } });

        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

        expect(await screen.findByText(/end date must be after start date/i)).toBeInTheDocument();
    });

    test('shows success message after successful update', async () => {
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        });

        expect(await screen.findByText(/deal updated successfully/i)).toBeInTheDocument();
        expect(defaultProps.onDealUpdated).toHaveBeenCalled();
    });

    test('shows delete confirmation when Delete Deal is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /delete deal/i }));
        expect(screen.getByText(/are you sure you want to delete this deal/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
    });

    test('calls handleClose when Cancel button is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
        expect(defaultProps.handleClose).toHaveBeenCalled();
    });
});
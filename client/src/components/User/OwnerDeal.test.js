import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import OwnerDeal from './OwnerDeal';

jest.mock('../Deals/ExpandedDeal', () => ({ open, handleClose }) =>
    open ? <div data-testid="expanded-deal"><button onClick={handleClose}>Close</button></div> : null
);

jest.mock('./EditDealDialog', () => ({ open, handleClose }) =>
    open ? <div data-testid="edit-deal-dialog"><button onClick={handleClose}>Close</button></div> : null
);

const mockDeal = {
    dealID: 1,
    dealName: 'Burger Special',
    dealDescription: 'A great deal',
    dealPrice: '9.99',
    restaurantName: 'Test Restaurant',
    dealValueRating: 4.0,
    dealTasteRating: 4.5,
    dealPortionRating: 3.5,
    numRatings: 10,
    totalVote: 5,
    userVote: null,
    dealDays: ['Monday'],
    startTime: '10:00',
    endTime: '14:00',
    validFrom: '2026-04-01',
    validTo: '2026-04-30',
};

describe('OwnerDeal Component', () => {

    beforeEach(() => {
        render(<OwnerDeal uuid="test-uuid" deal={mockDeal} reloadDeals={jest.fn()} />);
    });

    test('renders deal name', () => {
        expect(screen.getByText(/burger special/i)).toBeInTheDocument();
    });

    test('renders deal price', () => {
        expect(screen.getByText(/\$9.99/i)).toBeInTheDocument();
    });

    test('renders restaurant name', () => {
        expect(screen.getByText(/test restaurant/i)).toBeInTheDocument();
    });

    test('renders average rating when ratings exist', () => {
        expect(screen.getByText(/⭐/)).toBeInTheDocument();
        expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    test('renders Edit button', () => {
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    test('opens EditDealDialog when Edit button is clicked', () => {
        fireEvent.click(screen.getByRole('button', { name: /edit/i }));
        expect(screen.getByTestId('edit-deal-dialog')).toBeInTheDocument();
    });

    test('opens ExpandedDeal when deal name is clicked', () => {
        fireEvent.click(screen.getByText(/burger special/i));
        expect(screen.getByTestId('expanded-deal')).toBeInTheDocument();
    });

    test('shows No ratings yet when numRatings is 0', () => {
        render(<OwnerDeal uuid="test-uuid" deal={{ ...mockDeal, numRatings: 0 }} reloadDeals={jest.fn()} />);
        expect(screen.getAllByText(/no ratings yet/i).length).toBeGreaterThan(0);
    });
});
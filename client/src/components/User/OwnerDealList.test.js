import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import OwnerDealList from './OwnerDealList';

jest.mock('./OwnerDeal', () => ({ deal }) => (
    <div data-testid="owner-deal">{deal.dealName}</div>
));

const mockDeals = [
    { dealID: 1, dealName: 'Burger Special', dealPrice: '9.99', restaurantName: 'Test Restaurant', dealValueRating: 4, dealTasteRating: 4, dealPortionRating: 4, numRatings: 5 },
    { dealID: 2, dealName: 'Pizza Deal', dealPrice: '12.99', restaurantName: 'Test Restaurant', dealValueRating: 3, dealTasteRating: 3, dealPortionRating: 3, numRatings: 2 },
];

const mockLoadOwnerDeals = jest.fn(() => Promise.resolve(mockDeals));

describe('OwnerDealList Component', () => {

    beforeEach(() => {
        mockLoadOwnerDeals.mockClear();
    });

    test('shows loading state initially', () => {
        const neverResolves = jest.fn(() => new Promise(() => {}));
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={neverResolves}
                ownerDeals={[]}
                setOwnerDeals={jest.fn()}
            />
        );
        expect(screen.getByText(/loading your deals/i)).toBeInTheDocument();
    });

    test('renders deals after loading', async () => {
        const setOwnerDeals = jest.fn();
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={mockLoadOwnerDeals}
                ownerDeals={mockDeals}
                setOwnerDeals={setOwnerDeals}
            />
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('owner-deal')).toHaveLength(2);
        });
    });

    test('shows correct deal count', async () => {
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={mockLoadOwnerDeals}
                ownerDeals={mockDeals}
                setOwnerDeals={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/2 deals/i)).toBeInTheDocument();
        });
    });

    test('shows singular deal when count is 1', async () => {
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={jest.fn(() => Promise.resolve([mockDeals[0]]))}
                ownerDeals={[mockDeals[0]]}
                setOwnerDeals={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/1 deal\b/i)).toBeInTheDocument();
        });
    });

    test('shows empty state when no deals', async () => {
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={jest.fn(() => Promise.resolve([]))}
                ownerDeals={[]}
                setOwnerDeals={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/no deals found/i)).toBeInTheDocument();
        });
    });

    test('shows error message when fetch fails', async () => {
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={jest.fn(() => Promise.reject(new Error('Failed')))}
                ownerDeals={[]}
                setOwnerDeals={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/an error occurred loading your deals/i)).toBeInTheDocument();
        });
    });

    test('renders My Deals header', async () => {
        render(
            <OwnerDealList
                uuid="test-uuid"
                loadOwnerDeals={mockLoadOwnerDeals}
                ownerDeals={mockDeals}
                setOwnerDeals={jest.fn()}
            />
        );
        expect(screen.getByText(/my deals/i)).toBeInTheDocument();
    });
});
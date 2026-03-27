import { renderWithDealsProvider, screen, fireEvent, waitFor } from '../../utils/test-utils';
import ExpandedDeal from './ExpandedDeal';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

describe('ExpandedDeal', () => {

    const mockDeal = {
        dealID: 1,
        dealName: 'Burger Special',
        restaurantID: 123,
        restaurantName: 'Test Restaurant',
        dealDescription: 'Tasty burger with fries',
        dealPrice: 9.99,
        numRatings: 10,
        dealValueRating: 4.5,
        dealTasteRating: 5,
        dealPortionRating: 2.5,
        dealEditDate: '2024-01-01 13:16',
        fave: false,
        totalVote: 0,
        userVote: 0,
    };

    const mockDealNoRatings = {
        ...mockDeal,
        numRatings: 0,
        dealValueRating: 0,
        dealTasteRating: 0,
        dealPortionRating: 0,
    };

    const mockHours = [
        {
            dayOfWeek: 'Monday',
            dealStartTime: ['10:00', '14:00'],
            dealEndTime: ['12:00', '16:00'],
        },
        {
            dayOfWeek: 'Tuesday',
            dealStartTime: ['11:00'],
            dealEndTime: ['15:00'],
        },
    ];

    let handleClose;

    function setupFetchMocks({ deal = mockDeal, hours = mockHours } = {}) {
        global.fetch = jest.fn((url) => {
            if (url === '/api/deal') {
                return Promise.resolve({
                    ok: true,
                    json: async () => deal,
                });
            }

            if (url === '/api/deal/hours') {
                return Promise.resolve({
                    ok: true,
                    json: async () => hours,
                });
            }

            if (url === '/api/deal/ratings') {
                return Promise.resolve({
                    ok: true,
                    json: async () => deal,
                });
            }

            return Promise.reject(new Error('Unknown endpoint'));
        });
    }

    function renderComponent(props = {}) {
        handleClose = jest.fn();

        renderWithDealsProvider(
            <MemoryRouter>
                <ExpandedDeal
                    dealID={1}
                    open={true}
                    uuid={null}
                    handleClose={handleClose}
                    {...props}
                />
            </MemoryRouter>
        );
    }

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('displays the restaurant details', async () => {
        setupFetchMocks();

        renderComponent();

        expect(await screen.findByText(mockDeal.dealName)).toBeInTheDocument();
        expect(screen.getByText(mockDeal.dealDescription)).toBeInTheDocument();
        expect(screen.getByText(mockDeal.restaurantName)).toBeInTheDocument();
        // Price is rendered with a dollar sign, match with regex
        expect(await screen.findByText(new RegExp(`\\$\\s*${mockDeal.dealPrice}`))).toBeInTheDocument();
        // Fix typo: use dealEditDate
        expect(
            await screen.findByText(new RegExp(`Last updated:\\s*${mockDeal.dealEditDate}`))
        ).toBeInTheDocument();
    });

    test('calls handleClose when Close button is clicked', async () => {
        setupFetchMocks();
        renderComponent();

        const button = await screen.findByRole('button', { name: /close/i });
        fireEvent.click(button);

        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('calls APIs on render', async () => {
        setupFetchMocks();
        renderComponent();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/deal', expect.any(Object));
            expect(global.fetch).toHaveBeenCalledWith('/api/deal/hours', expect.any(Object));
        });
    });

    test('shows correct deal availability', async () => {
        setupFetchMocks();
        renderComponent();

        expect(await screen.findByText(/Monday:/)).toBeInTheDocument();
        expect(screen.getByText(/10:00 - 12:00/)).toBeInTheDocument();
        expect(screen.getByText(/14:00 - 16:00/)).toBeInTheDocument();
        expect(screen.getByText(/Tuesday:/)).toBeInTheDocument();
        expect(screen.getByText(/11:00 - 15:00/)).toBeInTheDocument();
    });

    test('shows loading message while hours are loading', async () => {
        global.fetch = jest.fn((url) => {
            if (url === '/api/deal') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockDeal,
                });
            }

            if (url === '/api/deal/hours') {
                return new Promise(() => []); // only hours hangs
            }

            return Promise.resolve({
                ok: true,
                json: async () => ([]),
            });
        });

        renderComponent();

        // Wait until deal loads so availability section renders
        await screen.findByText(mockDeal.dealName);

        expect(screen.getByText(/Loading availability.../)).toBeInTheDocument();
    });

    test('shows error message if hours fail to load', async () => {
        global.fetch = jest.fn((url) => {
            if (url === '/api/deal') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockDeal,
                });
            }

            if (url === '/api/deal/hours') {
                return Promise.reject(new Error('API failure'));
            }

            return Promise.resolve({
                ok: true,
                json: async () => ([]),
            });
        });

        renderComponent();

        expect(
            await screen.findByText(/Failed to load availability/i)
        ).toBeInTheDocument();
    });

    test('deals with no ratings display "No ratings yet"', async () => {
        setupFetchMocks({ deal: mockDealNoRatings });

        renderComponent();

        expect(await screen.findByText(/No ratings yet/i)).toBeInTheDocument();
    });

    test('ratings are displayed correctly', async () => {
        setupFetchMocks();
        renderComponent();

        expect(await screen.findByText(/Average Value Rating/i)).toBeInTheDocument();

        expect(screen.getByText(`⭐ ${mockDeal.dealValueRating.toFixed(1)}/5`)).toBeInTheDocument();
        expect(screen.getByText(`⭐ ${mockDeal.dealTasteRating.toFixed(1)}/5`)).toBeInTheDocument();
        expect(screen.getByText(`⭐ ${mockDeal.dealPortionRating.toFixed(1)}/5`)).toBeInTheDocument();

        const avg = (
            (mockDeal.dealTasteRating +
                mockDeal.dealValueRating +
                mockDeal.dealPortionRating) / 3
        ).toFixed(1);

        expect(screen.getByText(`⭐ ${avg}/5`)).toBeInTheDocument();
    });

    test('number of ratings is displayed', async () => {
        setupFetchMocks();
        renderComponent();

        expect(await screen.findByText(/\(10 Ratings\)/i)).toBeInTheDocument();
    });

});
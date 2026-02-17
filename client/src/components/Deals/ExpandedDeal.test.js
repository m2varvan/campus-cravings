import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
        dealValueRating: 4,
        dealTasteRating: 5,
        dealPortionRating: 3,
        dealEditData: '2024-01-01 13:16',
    };

    const mockDeal2 = {
        dealID: 1,
        dealName: 'Burger Special',
        restaurantID: 123,
        restaurantName: 'Test Restaurant',
        dealDescription: 'Tasty burger with fries',
        dealPrice: 9.99,
        numRatings: 0,
        dealValueRating: 0,
        dealTasteRating: 0,
        dealPortionRating: 0,
        dealEditData: '2024-01-01 13:16',
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

    function renderComponent(props = {}) {
        handleClose = jest.fn().mockName('handleClose');

        render(
        <MemoryRouter>
            <ExpandedDeal
            deal={mockDeal}
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

    test('displays the restaurant details', () => {
        renderComponent();
        expect(screen.getByText(mockDeal.dealName)).toBeInTheDocument();
        expect(screen.getByText(mockDeal.dealDescription)).toBeInTheDocument();
        expect(screen.getByText(mockDeal.restaurantName)).toBeInTheDocument();
        expect(screen.getByText(`$${mockDeal.dealPrice}`)).toBeInTheDocument();
        expect(screen.getByText(`Deal information last updated: ${mockDeal.dealEditData}`)).toBeInTheDocument();
    });

    test('calls handleClose when Close button is clicked', () => {
        renderComponent();
        const button = screen.getByRole('button', { name: /close/i })
        fireEvent.click(button);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    test('calls getDealHours on render', () => {
        // mock fetch
        global.fetch = jest.fn().mockReturnValue({
            ok: true,
            json: () => []
        });
        renderComponent();
        expect(global.fetch).toHaveBeenCalledWith('/api/dealhours', expect.any(Object));
    });

    test('shows correct deal availability', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockHours),
        });

        renderComponent();

        // Wait for the component to update after fetch resolves
        await waitFor(() => {
            expect(screen.getByText(/Monday:/)).toBeInTheDocument();
            expect(screen.getByText(/10:00 - 12:00/)).toBeInTheDocument();
            expect(screen.getByText(/14:00 - 16:00/)).toBeInTheDocument();
            expect(screen.getByText(/Tuesday:/)).toBeInTheDocument();
            expect(screen.getByText(/11:00 - 15:00/)).toBeInTheDocument();
        });

    });

    test('shows loading message while hours are loading in expanded deal info', async () => {
        let resolveFetch;
        global.fetch = jest.fn(() => new Promise((res) => { resolveFetch = res }));

        renderComponent();

        // Loading message should appear
        expect(screen.getByText(/Loading availability.../)).toBeInTheDocument();
    });

    test('shows error message if hours fail to load in expanded deal info', () => {
        global.fetch = jest.fn(() => {throw new Error('API failure')});
        renderComponent();
        expect(screen.getByText(/Failed to load availability/)).toBeInTheDocument();
    
    });

    test('deals with no ratings display "No ratings yet" in expanded deal info', () => {
        handleClose = jest.fn().mockName('handleClose');
        render(<ExpandedDeal
            deal={mockDeal2}
            open={true}
            uuid={null}
            handleClose={handleClose}
            />);

        expect(screen.getByText(/No ratings yet/i)).toBeInTheDocument();
    });

    test('ratings are displayed consistently with a star and (one decimal point)/5 in expanded deal info', () => {
        renderComponent();
        const avg40 = screen.getAllByText((/⭐ 4\.0\/5/i));
        expect(avg40).toHaveLength(2);
        expect(screen.getByText((/⭐ 5\.0\/5/i)))
        expect(screen.getByText((/⭐ 3\.0\/5/i)))
        expect(/Overall Rating/i).toBeInTheDocument()
        expect(/Portion Size Rating/i).toBeInTheDocument()
        expect(/Taste Rating/i).toBeInTheDocument()
        expect(/Value Rating/i).toBeInTheDocument()
        
    })

    test('average ratings are correctly calculated in expanded deal info', () => {
        renderComponent();
        const average = ((mockDeal.dealTasteRating + mockDeal.dealValueRating + mockDeal.dealPortionRating) / 3).toFixed(1)
        expect(screen.getByText(new RegExp(`⭐ ${average}/5`))).toBeInTheDocument()
    })

    test('the number of ratings contributing to the score can be seen in expanded deal info', () => {
        renderComponent();
        expect(screen.getByText(/(10 Ratings)/i)).toBeInTheDocument();
    })
    
});

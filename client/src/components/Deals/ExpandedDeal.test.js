import { render, screen, fireEvent } from '@testing-library/react';
import Deal from './Deal';
import ExpandedDeal from './ExpandedDeal';
import React from 'react';

describe('Expanded Deals', () => {
    const deal1 = {
        dealID: 1,
        dealName: 'Lunch Special',
        dealDescription: 'Choice of Veg of Chicken Dish Comes with Steam Rice Upgrade to Egg Fried Rice/Egg Noodles fo $1.99',
        dealPrice: '10.99',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '1',
        restaurantName: 'Hakka Nation',
        dayOfWeek: 'Monday',
        startTime: '11:30:00',
        endTime: '16:00:00',
    };

    const mockDeals = [deal1];

    test('allows navigation to restaurant details from promotion', () => {
        render(<Deal deal={deal1} />);

        const restaurantLink = screen.getByText(deal1.restaurantName);
        expect(restaurantLink).toBeInTheDocument();

        fireEvent.click(restaurantLink);
    });

    test.only('shows additional details when a promotion is selected', () => {
        render(
            <>
                <Deal deal={deal1} />
            </>
        );

        const dealButton = screen.getByText(deal1.dealName);
        fireEvent.click(dealButton);

        // Check that all details appear
        expect(screen.getByText(deal1.dealName)).toBeInTheDocument();
        expect(screen.getByText(deal1.dealDescription)).toBeInTheDocument();
        expect(screen.getByText(`$${deal1.dealPrice}`)).toBeInTheDocument();
        expect(screen.getByText(deal1.restaurantName)).toBeInTheDocument();
        // expect(screen.getByText(deal1.dayOfWeek)).toBeInTheDocument();
        // expect(screen.getByText(deal1.startTime)).toBeInTheDocument();
        // expect(screen.getByText(deal1.endTime)).toBeInTheDocument();
    });

    test('closes expanded promotion and returns to overview', () => {
        // Render ExpandedDeal with a mock close callback
        const mockClose = jest.fn();
        render(<ExpandedDeal deal={deal1} onClose={mockClose} />);

        // Assume there's a "Close" button
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockClose).toHaveBeenCalled();
    });
});

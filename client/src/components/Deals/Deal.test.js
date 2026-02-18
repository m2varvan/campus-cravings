import { render, screen, } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Deal from './Deal';

describe('Deal', () => {

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

    function renderComponent(props = {}) {
        
        render(
        <Deal
            deal={mockDeal}
            uuid={null}
            {...props}
            />
        );
    }

    test('displays the basic restaurant information', () => {
        renderComponent();
        expect(screen.getByText(mockDeal.dealName)).toBeInTheDocument();
        expect(screen.getByText(mockDeal.restaurantName)).toBeInTheDocument();
        expect(screen.getByText(`$${mockDeal.dealPrice}`)).toBeInTheDocument();
    });

});

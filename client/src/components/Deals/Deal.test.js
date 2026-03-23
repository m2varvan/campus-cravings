import { render, screen, } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Deal from './Deal';
import { renderWithDealsProvider } from '../../utils/test-utils';

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

    function renderComponent(props = {}) {
        
        renderWithDealsProvider(
        <Deal
            deal={mockDeal}
            uuid={null}
            {...props}
            />
        );
    }

    test('displays the basic restaurant information on deal card', () => {
        renderComponent();
        expect(screen.getByText(mockDeal.dealName)).toBeInTheDocument();
        expect(screen.getByText(mockDeal.restaurantName)).toBeInTheDocument();
        expect(screen.getByText(`$${mockDeal.dealPrice}`)).toBeInTheDocument();
    });

    test('deals with no ratings display "No ratings yet" on deal card', () => {
        renderWithDealsProvider(<Deal
            deal={mockDeal2}
            uuid={null}
            />);

        expect(screen.getByText(/No ratings yet/i)).toBeInTheDocument();
    });

    test('ratings are displayed consistently with a star and (one decimal point)/5 on deal card', () => {
        renderComponent();
        expect(screen.getByText((/⭐ 4\.0\/5/i))).toBeInTheDocument();
    })

    test('average ratings are correctly calculated', () => {
        renderComponent();
        const average = ((mockDeal.dealTasteRating + mockDeal.dealValueRating + mockDeal.dealPortionRating) / 3).toFixed(1)
        expect(screen.getByText(new RegExp(`⭐ ${average}/5`))).toBeInTheDocument()
    })

    test('the number of ratings contributing to the score can be seen on deal card', () => {
        renderComponent();
        expect(screen.getByText(/(10)/i)).toBeInTheDocument();
    })

});

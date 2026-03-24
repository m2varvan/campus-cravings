import RateDeal from "./RateDeal";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

describe('RateDeal', () => {

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
        numRatings: 0,
        avgTasteRating: 0,
        avgPortionRating: 0,
        avgValueRating: 0,
    };

    const updateRatingsMock = jest.fn();


    test('User must be logged in to rate deal', () => {
        render(
            <RateDeal 
                uuid={null}
                deal={deal1}
                uapdateRatings={updateRatingsMock}
            />
        );

        expect(screen.getByText(/Log in to rate this deal/i)).toBeInTheDocument();
    });


});

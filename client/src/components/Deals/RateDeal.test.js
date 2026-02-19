import RateDeal from "./RateDeal";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ExpandedDeal from "./ExpandedDeal";

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

    function renderComponent(props = {}) {
            
        render(
        <ExpandedDeal
            uuid={'user-123'}
            deal={deal1}
        />,
        <RateDeal 
            uuid={'user-123'}
            deal={deal1}
            />
        );
    }

    test('User must be logged in to rate deal', () => {
        render(
            <RateDeal 
                uuid={null}
                deal={deal1}
            />
        );

        expect(screen.getByText(/Log in to rate this deal/i)).toBeInTheDocument();
    });


    test('User must rate all 3 categories', () => {
        renderComponent();

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        expect(screen.getByText(/please rate all categories/i)).toBeInTheDocument();
    });

    test('Ratings must be on scale between 0-5', () => {
        renderComponent();

        const tasteInput = screen.getByLabelText(/taste/i);
        fireEvent.change(tasteInput, { target: { value: 6 } });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);
        expect(screen.getByText(/rating must be between 0 and 5/i)).toBeInTheDocument();
    });


    test('Confirmation message is displayed when rating is submitted', () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/taste/i), { target: { value: 4 } });
        fireEvent.change(screen.getByLabelText(/portion/i), { target: { value: 4 } });
        fireEvent.change(screen.getByLabelText(/value/i), { target: { value: 5 } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        expect(screen.getByText(/rating submitted successfully/i)).toBeInTheDocument();
    });


    test('Average ratings are updated after the rating is submitted', () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/taste/i), { target: { value: 1 } });
        fireEvent.change(screen.getByLabelText(/portion/i), { target: { value: 2 } });
        fireEvent.change(screen.getByLabelText(/value/i), { target: { value: 3 } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        expect(screen.getByText((/⭐ 1\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 2\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 3\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/(1 Rating)/i))).toBeInTheDocument();
    });

    test('User can update their previous rating', () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/taste/i), { target: { value: 3 } });
        fireEvent.change(screen.getByLabelText(/portion/i), { target: { value: 4 } });
        fireEvent.change(screen.getByLabelText(/value/i), { target: { value: 5 } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        expect(screen.getByText((/⭐ 3\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 4\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 5\.0\/5/i))).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /edit/i }));

        fireEvent.change(screen.getByLabelText(/taste/i), { target: { value: 0 } });
        fireEvent.change(screen.getByLabelText(/portion/i), { target: { value: 1 } });
        fireEvent.change(screen.getByLabelText(/value/i), { target: { value: 2 } });

        fireEvent.click(screen.getByRole('button', { name: /update/i}));

        expect(screen.getByText((/⭐ 0\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 1\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 2\.0\/5/i))).toBeInTheDocument();


        expect(screen.getByText(/rating updated successfully/i)).toBeInTheDocument();

        
    });

    test('User can delete their previous rating', () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/taste/i), { target: { value: 3 } });
        fireEvent.change(screen.getByLabelText(/portion/i), { target: { value: 4 } });
        fireEvent.change(screen.getByLabelText(/value/i), { target: { value: 5 } });

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        expect(screen.getByText((/⭐ 3\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 4\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 5\.0\/5/i))).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /delete/i }));

        expect(screen.getByText(/rating successfully deleted/i)).toBeInTheDocument();

        expect(screen.getByText((/no ratings yet/i))).toBeInTheDocument();
    });

});

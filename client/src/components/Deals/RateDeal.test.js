import RateDeal from "./RateDeal";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock fetch API
global.fetch = jest.fn();

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

    beforeEach(() => {
    global.fetch = jest.fn();
    });

    afterEach(() => {
    jest.resetAllMocks();
    });


    test('User must be logged in to rate deal', () => {
        render(
            <RateDeal 
                uuid={null}
                deal={deal1}
                updateRatings={updateRatingsMock}
            />
        );

        expect(screen.getByText(/Log in to rate this deal/i)).toBeInTheDocument();
    });

    test.skip('Ratings must be on scale between 0-5', async () => {
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
        });

        render(<RateDeal uuid="user-123" deal={deal1} updateRatings={updateRatingsMock} />);

        // Button to access rating buttons
        await waitFor(() => screen.getByText(/Submit a Rating/i));
        fireEvent.click(screen.getByText(/Submit a Rating/i));

        // Change ratings using labels
        fireEvent.click(screen.getByLabelText(/taste-rating/i).querySelector('input[value="4"]'));
        fireEvent.click(screen.getByLabelText(/portion-rating/i).querySelector('input[value="4"]'));
        fireEvent.click(screen.getByLabelText(/value-rating/i).querySelector('input[value="5"]'));

        // Submit
        await waitFor(() => screen.getByText(/Submit Rating/i));
        fireEvent.click(screen.getByText(/Submit Rating/i));
        
        // Error message appears showing invalid rating
        await waitFor(() => expect(screen.getByText(/rating must be between 0 and 5/i)).toBeInTheDocument());
        
    });


    test.skip('allows user to submit a new rating', async () => {
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
        });

        render(<RateDeal uuid="user-123" deal={deal1} updateRatings={updateRatingsMock} />);

        // Button to access rating buttons
        await waitFor(() => screen.getByText(/Submit a Rating/i));
        fireEvent.click(screen.getByText(/Submit a Rating/i));

        // Change ratings using labels
        fireEvent.click(screen.getByLabelText(/taste-rating/i).querySelector('input[value="4"]'));
        fireEvent.click(screen.getByLabelText(/portion-rating/i).querySelector('input[value="4"]'));
        fireEvent.click(screen.getByLabelText(/value-rating/i).querySelector('input[value="5"]'));

        // Submit
        await waitFor(() => screen.getByText(/Submit Rating/i));
        fireEvent.click(screen.getByText(/Submit Rating/i));

        await waitFor(() => expect(screen.getByText(/Rating submitted successfully!/i)).toBeInTheDocument());
        expect(updateRatingsMock).toHaveBeenCalled();
    });


    test.skip('Average ratings are updated after the rating is submitted', async () => {
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
        });

        render(<RateDeal uuid="user-123" deal={deal1} updateRatings={updateRatingsMock} />);

        // Button to access rating buttons
        await waitFor(() => screen.getByText(/Submit a Rating/i));
        fireEvent.click(screen.getByText(/Submit a Rating/i));

        // Change ratings using labels
        fireEvent.click(screen.getByLabelText(/taste-rating/i).querySelector('input[value="3"]'));
        fireEvent.click(screen.getByLabelText(/portion-rating/i).querySelector('input[value="4"]'));
        fireEvent.click(screen.getByLabelText(/value-rating/i).querySelector('input[value="5"]'));

        // Submit
        await waitFor(() => screen.getByText(/Submit Rating/i));
        fireEvent.click(screen.getByText(/Submit Rating/i));

        // Update
        await waitFor(() => expect(screen.getByText(/Rating submitted successfully!/i)).toBeInTheDocument());
        expect(updateRatingsMock).toHaveBeenCalled();

    

        expect(screen.getByText((/⭐ 3\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 4\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 5\.0\/5/i))).toBeInTheDocument();
    });

    test.skip('allows user to edit an existing rating', async () => {
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ ratingID: 1, tasteRating: 3, portionRating: 4, valueRating: 5, ratingDate: '2026-02-19' }],
        });

        render(<RateDeal uuid="user-123" deal={deal1} updateRatings={updateRatingsMock} />);

        // Wait for user rating to load
        await waitFor(() => screen.getByText(/Edit my Rating/i));
        expect(screen.getByText((/⭐ 3\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 4\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 5\.0\/5/i))).toBeInTheDocument();

        // Click edit
        await waitFor(() => screen.getByText(/Edit my Rating/i));
        fireEvent.click(screen.getByText(/Edit my Rating/i));

        // Change ratings
        fireEvent.click(screen.getByLabelText(/taste-rating/i).querySelector('input[value="2"]'));

        await waitFor(() => screen.getByText(/Update Rating/i));
        fireEvent.click(screen.getByText(/Update Rating/i));

        await waitFor(() => expect(screen.getByText(/Rating updated successfully!/i)).toBeInTheDocument());
        expect(updateRatingsMock).toHaveBeenCalled();
        expect(screen.getByText((/⭐ 2\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 4\.0\/5/i))).toBeInTheDocument();
        expect(screen.getByText((/⭐ 5\.0\/5/i))).toBeInTheDocument();
    });

    test('allows user to delete rating', async () => {
        fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ ratingID: 1, tasteRating: 3, portionRating: 4, valueRating: 5, ratingDate: '2026-02-19' }],
        });

        render(<RateDeal uuid="user-123" deal={deal1} updateRatings={updateRatingsMock} />);

        await waitFor(() => screen.getByText(/Delete my Rating/i));

        // Mock delete API
        fetch.mockResolvedValueOnce({ ok: true });

        fireEvent.click(screen.getByText(/Delete my Rating/i));

        await waitFor(() => expect(screen.getByText(/Rating deleted successfully!/i)).toBeInTheDocument());
    });

});

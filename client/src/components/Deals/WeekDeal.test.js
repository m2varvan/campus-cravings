import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react'; 
import WeekDeal from './WeekDeal';



describe('WeekDeal', () => {
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
    const deal2 = {
        dealID: 2,
        dealName: 'Sandwhich Specials',
        dealDescription: 'Sandwhich & Bubble tea combo Your choice of regular size bubble tea and fresh made panini (blueberry brie, bacon and apple butter brie, beef cheddar n onion, spinach dip) add $2 for large size',
        dealPrice: '15.00',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '5',
        restaurantName: 'Sweet Dreams Teashop',
        dayOfWeek: 'Monday',
        startTime: '11:00:00',
        endTime: '14:00:00',
        numRatings: 0,
        avgTasteRating: 0,
        avgPortionRating: 0,
        avgValueRating: 0,
    };
    const deal3 = {
        dealID: 20,
        dealName: 'Promo Special',
        dealDescription: '',
        dealPrice: '19.99',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '33',
        restaurantName: 'Baba Grill',
        dayOfWeek: 'Tuesday',
        startTime: '11:00:00',
        endTime: '21:00:00',
        numRatings: 0,
        avgTasteRating: 0,
        avgPortionRating: 0,
        avgValueRating: 0,
    };
    const deal4 = {
        dealID: 4,
        dealName: 'Cluckin Awesome Waffle Hour',
        dealDescription: '',
        dealPrice: '2.00',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '16',
        restaurantName: "Aunty's Kitchen",
        dayOfWeek: 'Wednesday',
        startTime: '15:00:00',
        endTime: '17:00:00',
        numRatings: 0,
        avgTasteRating: 0,
        avgPortionRating: 0,
        avgValueRating: 0,
    };
    const deal5 = {
        dealID: 5,
        dealName: 'Tonkatsu Udon',
        dealDescription: 'Limited time - $1 off',
        dealPrice: '15.99',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '3',
        restaurantName: 'Izna Poke Plus',
        dayOfWeek: 'Friday',
        startTime: '11:00:00',
        endTime: '21:00:00',
        numRatings: 0,
        avgTasteRating: 0,
        avgPortionRating: 0,
        avgValueRating: 0,
    };

    const mockDeals = {
        Monday: [deal1, deal2],
        Tuesday: [deal3],
        Wednesday: [deal4],
        Thursday: [],
        Friday: [deal5],
        Saturday: [],
        Sunday: []
    };

    let loadWeekDeals

    function renderComponent(props = {}) {
        loadWeekDeals = jest.fn().mockName('loadWeekDeals');

        render(<WeekDeal
            loadWeekDeals={loadWeekDeals}
            error={false}
            loading={false}
            weekDeals={mockDeals}
            uuid={null}
            {...props} />);
    }

    test('loads weekly promotions on the first render', async () => {
        renderComponent();
        await waitFor(() => {
            expect(loadWeekDeals).toHaveBeenCalled();
        });
    });

    test('displays dish name for each deal under proper week day name', () => {
        renderComponent();

        const section_monday = screen.getByTestId('monday');
        expect(within(section_monday).getByText(/monday/i)).toBeInTheDocument();
        expect(within(section_monday).getByText((deal1.dealName))).toBeInTheDocument();
        expect(within(section_monday).getByText((deal2.dealName))).toBeInTheDocument();

        const section_tues = screen.getByTestId('tuesday');
        expect(within(section_tues).getByText(/tuesday/i)).toBeInTheDocument();
        expect(within(section_tues).getByText((deal3.dealName))).toBeInTheDocument();

        const section_wed = screen.getByTestId('wednesday');
        expect(within(section_wed).getByText(/wednesday/i)).toBeInTheDocument();
        expect(within(section_wed).getByText((deal4.dealName))).toBeInTheDocument();

        const section_fri = screen.getByTestId('friday');
        expect(within(section_fri).getByText(/friday/i)).toBeInTheDocument();
        expect(within(section_fri).getByText((deal5.dealName))).toBeInTheDocument();
        
    });

    
    test('displays "No promotions available on {day name}" if no promotions exist', () => {
        renderComponent();
        const section = screen.getByTestId('saturday');
        expect(within(section).getAllByText(/saturday/i)[0]).toBeInTheDocument();
        expect(within(section).getByText(/no promotions available/i)).toBeInTheDocument();
        
    });


    test('displays error message if promotions fail to load', () => {
        const loadWeekDeals= jest.fn().mockName('loadWeekDeals');
        render(<WeekDeal weekDeals={[]}
                        loadWeekDeals={loadWeekDeals}
                        loading={false}
                        error={true}
                        uuid={null} />);
        expect(screen.getByText(/Something went wrong while loading deals. Please try again./i)).toBeInTheDocument();
    });

    test('displays loading message while deals are loading', () => {
        const loadWeekDeals = jest.fn().mockName('loadWeekDeals');
        render(<WeekDeal weekDeals={[]}
                        loadWeekDeals={loadWeekDeals}
                        loading={true}
                        error={false}
                        uuid={null} />);
        expect(screen.getByText(/Loading weekly deals/i)).toBeInTheDocument();
    });

    test('limits to 6 promotions by default and shows "See more" for extra', () => {
        const manyPromos = Array.from({ length: 10 }, (_, i) => ({
            dealID: i,
            dealName: `Promo ${i}`,
            dealDescription: `Desctiption ${i}`,
            dealPrice: i,
            dealEditDate: '2026-02-14 13:48:34',
            restaurantID: '1',
            restaurantName: 'Restaurant name' + i,
            numRatings: 0,
            avgTasteRating: 0,
            avgPortionRating: 0,
            avgValueRating: 0,
            dayOfWeek: 'Monday',
            startTime: '11:30:00',
            endTime: '16:00:00',
        }));
        const manyPromosObject = {Monday: manyPromos}
        const loadWeekDeals = jest.fn().mockName('loadWeekDeals');
        render(<WeekDeal weekDeals={manyPromosObject}
                        loadWeekDeals={loadWeekDeals}
                        loading={false}
                        error={false}
                        uuid={null} />);
        for (let i = 0; i < 6; i++) {
            expect(screen.getByText(`Promo ${i}`)).toBeInTheDocument();
        }
        expect(screen.getByText(/show more/i)).toBeInTheDocument();
        expect(screen.queryByText('Promo 6')).not.toBeInTheDocument();
    });
});


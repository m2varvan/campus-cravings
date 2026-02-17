import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react'; 
import TodayDeal from './TodayDeal';



describe('TodayDeal', () => {
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
        dayOfWeek: 'Monday',
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
        dayOfWeek: 'Monday',
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
        dayOfWeek: 'Monday',
        startTime: '11:00:00',
        endTime: '21:00:00',
        numRatings: 0,
        avgTasteRating: 0,
        avgPortionRating: 0,
        avgValueRating: 0,
    };

    const mockDeals = [deal1, deal2, deal3, deal4, deal5];

    let loadTodayDeals

    function renderComponent(props = {}) {
        loadTodayDeals = jest.fn().mockName('loadTodayDeals');

        render(<TodayDeal 
            loadTodayDeals={loadTodayDeals}
            error={false}
            loading={false}
            todayDeals={mockDeals}
            uuid={null}
            {...props} />);
    }

    test('loads today promotions on the first render', async () => {
        renderComponent();
        await waitFor(() => {
            expect(loadTodayDeals).toHaveBeenCalled();
        });
    });

    test('displays promotions available for the current day', () => {
        renderComponent();
        mockDeals.forEach((promo) => {
            expect(screen.getByText(promo.dealName)).toBeInTheDocument();
        });
    });


    test('displays dish name, price, and restaurant name', () => {
        renderComponent();
        mockDeals.forEach((promo) => {
            expect(screen.getByText(promo.dealName)).toBeInTheDocument();
            expect(screen.getByText(`$${promo.dealPrice}`)).toBeInTheDocument();
            expect(screen.getByText(promo.restaurantName)).toBeInTheDocument();
        });
    });
    
    test('displays "No promotions available." if no promotions exist', () => {
        const loadTodayDeals = jest.fn().mockName('loadTodayDeals');
        render(<TodayDeal todayDeals={[]}
                        loadTodayDeals={loadTodayDeals}
                        loading={false}
                        error={false}
                        uuid={null} />);
        expect(screen.getByText(/No promotions available/i)).toBeInTheDocument();
    });


    test('displays error message if promotions fail to load', () => {
        const loadTodayDeals = jest.fn().mockName('loadTodayDeals');
        render(<TodayDeal todayDeals={[]}
                        loadTodayDeals={loadTodayDeals}
                        loading={false}
                        error={true}
                        uuid={null} />);
        expect(screen.getByText(/Something went wrong while loading deals. Please try again./i)).toBeInTheDocument();
    });

    test('limits to 12 promotions by default and shows "See more" for extra', () => {
        const manyPromos = Array.from({ length: 12 }, (_, i) => ({
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
        const loadTodayDeals = jest.fn().mockName('loadTodayDeals');
        render(<TodayDeal todayDeals={manyPromos}
                        loadTodayDeals={loadTodayDeals}
                        loading={false}
                        error={false}
                        uuid={null} />);
        for (let i = 0; i < 12; i++) {
            expect(screen.getByText(`Promo ${i}`)).toBeInTheDocument();
        }
        expect(screen.queryByText('Promo 20')).not.toBeInTheDocument();
    });
});


import { render, screen } from '@testing-library/react';
import Promotion from './Promotion';
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
    };
    const deal3 = {
        dealID: 20,
        dealName: 'Promo Special',
        dealDescription: '',
        dealPrice: '10.99',
        dealEditDate: '2026-02-14 13:48:34',
        restaurantID: '33',
        restaurantName: 'Baba Grill',
        dayOfWeek: 'Monday',
        startTime: '11:00:00',
        endTime: '21:00:00',
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
    };

    const mockPromotions = [deal1, deal2, deal3, deal4, deal5];

    test('loads today promotions on the first render', () => {
        const loadTodayPromotions = jest.fn().mockName('loadTodayPromotions');
        render(<TodayDeal loadTodayPromotions={loadTodayPromotions} />);
        expect(loadTodayPromotions).toHaveBeenCalled();
    });

    test('displays promotions available for the current day', () => {
        render(<TodayDeal promotions={mockPromotions} />);
        mockPromotions.forEach((promo) => {
            expect(screen.getByText(promo.dealName)).toBeInTheDocument();
        });
    });

    test('displays dish name, price, and restaurant name', () => {
        render(<TodayDeal promotions={mockPromotions} />);
        mockPromotions.forEach((promo) => {
            expect(screen.getByText(promo.dealName)).toBeInTheDocument();
            expect(screen.getByText(`$${promo.dealPrice}`)).toBeInTheDocument();
            expect(screen.getByText(promo.restaurantName)).toBeInTheDocument();
        });
    });
    
    test('displays "No promotions available." if no promotions exist', () => {
        render(<TodayDeal promotions={[]} />);
        expect(screen.getByText(/No promotions available/i)).toBeInTheDocument();
    });

    test('does not require login to view daily promotions', () => {
        render(<TodayDeal uuid={null} promotions={mockPromotions} />);
        mockPromotions.forEach((promo) => {
            expect(screen.getByText(promo.dealName)).toBeInTheDocument();
        });
    });

    test('displays error message if promotions fail to load', () => {
        render(<Promotion error="An error occurred while loading promotions." />);
        expect(screen.getByText(/An error occurred while loading promotions/i)).toBeInTheDocument();
    });

    test('limits to 20 promotions by default and shows "See more" for extra', () => {
        const manyPromos = Array.from({ length: 25 }, (_, i) => ({
            dealID: i,
            dealName: `Promo ${i}`,
            dealDescription: `Desctiption ${i}`,
            dealPrice: i,
            dealEditDate: '2026-02-14 13:48:34',
            restaurantID: '1',
            restaurantName: 'Restaurant name' + i,
            dayOfWeek: 'Monday',
            startTime: '11:30:00',
            endTime: '16:00:00',
        }));
        render(<Promotion promotions={manyPromos} />);
        for (let i = 0; i < 20; i++) {
            expect(screen.getByText(`Promo ${i}`)).toBeInTheDocument();
        }
        expect(screen.queryByText('Promo 20')).not.toBeInTheDocument();
        expect(screen.getByText(/See more/i)).toBeInTheDocument();
    });
});


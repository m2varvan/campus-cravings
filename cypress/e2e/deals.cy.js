describe('Showing Deals', () => {
    const dayOfWeek = 'Monday';
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
        dealPrice: '10.99',
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
    }
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

    
    
    it("Shows Monday's Deals from the server", () => {

        cy.intercept('GET', '/api/todaydeals', [
            deal1, deal2, deal3, deal4, deal5
        ]);

        cy.visit('/');
        cy.contains("Today's Deals");
        cy.contains(dayOfWeek);

        cy.contains(deal1.dealName);
        cy.contains(deal1.restaurantName);
        cy.contains('$' + deal1.dealPrice);

        cy.contains(deal2.dealName);
        cy.contains(deal2.restaurantName);
        cy.contains('$' + deal2.dealPrice);

        cy.contains(deal3.dealName);
        cy.contains(deal3.restaurantName);
        cy.contains('$' + deal3.dealPrice);

        cy.contains(deal4.dealName);
        cy.contains(deal4.restaurantName);
        cy.contains('$' + deal4.dealPrice);

        cy.contains(deal5.dealName);
        cy.contains(deal5.restaurantName);
        cy.contains('$' + deal5.dealPrice);

    })

})
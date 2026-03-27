describe("Search functionality", () => {
  const rest = {
    restaurant_id: 1,
    restaurant_name: "Test Resto",
    city: "City",
  };

  const deal = {
    deal_id: 10,
    restaurant_id: 1,
    deal_name: "Test Deal",
  };

  it("shows restaurant and deal results", () => {
    // intercept the lightweight search response
    cy.intercept("GET", "/api/search?*", {
      restaurants: [rest],
      deals: [deal],
    });

    // intercept user search
    cy.intercept("GET", "/api/search/users?*", []);

    // intercept full restaurant list used for favourites
    cy.intercept("POST", "/api/get-restaurants", [
      { restaurant_id: 1, is_favourited: true },
    ]);

    // intercept all ratings
    cy.intercept("POST", "/api/restaurant-rating", []);

    // intercept restaurant hours
    cy.intercept("POST", "/api/restaurant-hours", []);

    // intercept all deals — used by DealsContext via useDeals
    cy.intercept("POST", "/api/all/deals", [
      {
        dealID: 10,
        restaurantID: 1,
        restaurantName: "Test Resto",
        dealName: "Test Deal",
        dealDescription: "n/a",
        dealPrice: "5.00",
        dealEditData: null,
        dayOfWeek: "Monday",
        dealStartTime: [],
        dealEndTime: [],
        dealValueRating: 0,
        dealTasteRating: 0,
        dealPortionRating: 0,
        numRatings: 0,
        totalVote: 0,
        userVote: null,
        fave: 0,
      },
    ]);

    // navigate directly to search page
    cy.visit("/search?q=test");

    // restaurant card should be visible
    cy.contains("Test Resto");
    // deal card should be visible with price
    cy.contains("Test Deal");
    cy.contains("$5");
  });
});

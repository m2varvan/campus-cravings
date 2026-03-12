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

    // intercept full restaurant list used for favourites
    cy.intercept("POST", "/api/get-restaurants", [
      { restaurant_id: 1, is_favourited: true },
    ]);

    // intercept restaurant-deals call
    cy.intercept("POST", "/api/restaurant-deals", [
      {
        dealID: 10,
        dealName: "Test Deal",
        dealPrice: 5,
        restaurant_name: "Test Resto",
        avg_value_rating: 0,
        avg_portion_rating: 0,
        avg_taste_rating: 0,
        number_of_ratings: 0,
        total_votes: 0,
        user_vote: 0,
        daysOfWeek: ["Monday"],
      },
    ]);

    // intercept week/deals for favourites map
    cy.intercept("POST", "/api/week/deals", { Monday: [{ dealID: 10, fave: true }] });

    // navigate directly to search page
    cy.visit("/search?q=test");

    // restaurant card should be visible
    cy.contains("Test Resto");
    // deal card should be visible with price
    cy.contains("Test Deal");
    cy.contains("$5");
  });
});
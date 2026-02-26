// cypress/e2e/reviews.cy.js
describe("Restaurant Reviews E2E", () => {
  const mockRestaurant = {
    restaurant_id: 1,
    restaurant_name: "Hakka Nation",
    street_address: "170 University Ave W",
    unit: null,
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3E9",
    website_url: "https://hakkanation.ca/waterloo/",
    phone_number: "+1 519-888-7575",
    created_at: "2026-02-14 12:50:46",
    updated_at: "2026-02-22 22:00:19",
    cuisine: "Chinese / Indian",
  };

  const mockDeals = [
    {
      dealID: 1,
      dealName: "Lunch Special",
      dealDescription: "A delicious lunch deal",
      dealPrice: 10.99,
      dealEditData: "2026-02-14 13:48:34",
      restaurantID: 1,
      restaurantName: "Hakka Nation",
      numRatings: 0,
      dealTasteRating: 0,
      dealValueRating: 0,
      dealPortionRating: 0,
    },
  ];

  const mockReviews = [
    {
      reviewID: 1,
      reviewText: "Amazing food!",
      reviewScore: 5,
      reviewerName: "Test User",
    },
  ];

  beforeEach(() => {
    // Stub restaurant info APIs
    cy.intercept("POST", "/api/restaurant-info", mockRestaurant);
    cy.intercept("POST", "/api/restaurant-deals", mockDeals);
    cy.intercept("POST", "/api/restaurant-hours", [
      { dayOfWeek: "Monday", startTimes: ["11:00"], endTimes: ["14:00"] },
    ]);
    cy.intercept("POST", "/api/restaurant-rating", {
      total_ratings: 1,
      avg_value_score: 4.5,
      avg_taste_score: 5,
      avg_portion_score: 4,
    });

    // Stub review API
    cy.intercept("POST", "/api/reviews", mockReviews);

    // Visit the Restaurant page
    cy.visit("/Restaurant");
  });

  it("opens restaurant dialog and shows reviews", () => {
    // Open restaurant dialog
    cy.contains(mockRestaurant.restaurant_name).click();

    // Dialog should be visible
    cy.get('[role="dialog"]').should("be.visible");

    cy.get('[role="dialog"]').within(() => {
      // Check restaurant details
      cy.contains(mockRestaurant.restaurant_name);
      cy.contains(mockRestaurant.street_address);
      cy.contains(`${mockRestaurant.city}, ${mockRestaurant.province}`);
      cy.contains(mockRestaurant.phone_number);
      cy.contains(mockRestaurant.cuisine);
      cy.get(`a[href="${mockRestaurant.website_url}"]`).should(
        "contain",
        "Visit Official Website"
      );

      // Check deal inside dialog
      cy.contains(mockDeals[0].dealName);
      cy.contains("$" + mockDeals[0].dealPrice);

      // Check review
      cy.contains(mockReviews[0].reviewText);

      // Close dialog
      cy.contains("Close").click();
    });

    cy.get('[role="dialog"]').should("not.exist");
  });
});
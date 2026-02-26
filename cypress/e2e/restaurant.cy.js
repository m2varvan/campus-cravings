describe("Showing Restaurants", () => {
  const restaurant1 = {
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

  const restaurant2 = {
    restaurant_id: 5,
    restaurant_name: "Sweet Dreams Teashop",
    street_address: "170 University Ave W",
    unit: "14",
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3E9",
    website_url: null,
    phone_number: "+1 519-747-2442",
    created_at: "2026-02-14 12:50:46",
    updated_at: "2026-02-22 22:00:19",
    cuisine: "Bubble tea / Dessert",
  };

  const restaurant3 = {
    restaurant_id: 33,
    restaurant_name: "Baba Grill",
    street_address: "170 University Ave W",
    unit: null,
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3E9",
    website_url: null,
    phone_number: "+1 519-208-8897",
    created_at: "2026-02-14 12:50:46",
    updated_at: "2026-02-22 22:00:20",
    cuisine: "Middle Eastern / Asian",
  };

  const mockHours = [
    { dayOfWeek: "Monday", startTimes: ["11:30"], endTimes: ["00:00"] },
  ];

  const mockDeals = [
    {
      deal_id: 10,
      deal_name: "Lunch Special",
      deal_price: 9.99,
      description: "A great lunch deal",
    },
  ];

  const mockDealHours = {
    10: [{ day_of_week: "Monday", start_times: "11:30", end_times: "00:00" }],
  };

  it("shows restaurants from the server and displays correct details", () => {
    cy.intercept("GET", "/api/get-restaurants", [
      restaurant1,
      restaurant2,
      restaurant3,
    ]).as("getRestaurants");
    cy.intercept("POST", "/api/restaurant-hours", mockHours).as("getHours");
    cy.intercept("POST", "/api/get-deals-by-restaurant", mockDeals).as(
      "getDeals",
    );
    cy.intercept(
      "POST",
      "/api/deal-availability-by-restaurant",
      mockDealHours,
    ).as("getDealHours");

    cy.visit("/Restaurant");
    cy.wait("@getRestaurants");

    cy.contains(restaurant1.restaurant_name);
    cy.contains(restaurant2.restaurant_name);
    cy.contains(restaurant3.restaurant_name);

    cy.get(
      `[data-testid="expand-restaurantID-${restaurant1.restaurant_id}"]`,
    ).click();
    cy.get('[role="dialog"]').should("be.visible");

    cy.get('[role="dialog"]').within(() => {
      cy.contains(restaurant1.restaurant_name);
      cy.contains(restaurant1.street_address);
      cy.contains(`${restaurant1.city}, ${restaurant1.province}`);
      cy.contains(restaurant1.postal_code);
      cy.contains(restaurant1.phone_number);
      cy.get(`a[href="${restaurant1.website_url}"]`)
        .should("be.visible")
        .and("contain", "Visit Official Website");
      cy.contains(restaurant1.cuisine);
      cy.contains(/Monday:/i);
      cy.contains("11:30 - 00:00");
      cy.contains(mockDeals[0].deal_name);
      cy.contains("$" + mockDeals[0].deal_price);
      cy.contains(mockDeals[0].description);
      cy.contains("button", /close/i).click();
    });

    cy.get('[role="dialog"]').should("not.exist");
  });
});

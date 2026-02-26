describe("Showing Restaurants", () => {
  const restaurant1 = {
    restaurant_id: 1,
    restaurant_name: "Hakka Nation",
    street_address: "170 University Ave W",
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3E9",
    website_url: "https://hakkanation.ca/waterloo/",
    phone_number: "+1 519-888-7575",
    cuisine: "Chinese / Indian",
    unit: null,
    created_at: "2026-02-14 12:50:46",
    updated_at: "2026-02-22 22:00:19",
  };

  const restaurant2 = {
    restaurant_id: 5,
    restaurant_name: "Sweet Dreams Teashop",
    street_address: "170 University Ave W",
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3E9",
    website_url: null,
    phone_number: "+1 519-747-2442",
    cuisine: "Bubble tea / Dessert",
    unit: "14",
    created_at: "2026-02-14 12:50:46",
    updated_at: "2026-02-22 22:00:19",
  };

  const restaurant3 = {
    restaurant_id: 33,
    restaurant_name: "Baba Grill",
    street_address: "170 University Ave W",
    city: "Waterloo",
    province: "ON",
    postal_code: "N2L 3E9",
    website_url: null,
    phone_number: "+1 519-208-8897",
    cuisine: "Middle Eastern / Asian",
    unit: null,
    created_at: "2026-02-14 12:50:46",
    updated_at: "2026-02-22 22:00:20",
  };

  it("Shows restaurants from the server and their details", () => {
    cy.intercept("GET", "/api/get-restaurants", [
      restaurant1,
      restaurant2,
      restaurant3,
    ]);
    cy.intercept("POST", "/api/restaurant-hours", []);
    cy.intercept("POST", "/api/get-deals-by-restaurant", []);
    cy.intercept("POST", "/api/deal-availability-by-restaurant", {});

    cy.visit("/Restaurant");

    cy.contains("University Shops Plaza Restaurants");

    cy.contains(restaurant1.restaurant_name);
    cy.contains(restaurant2.restaurant_name);
    cy.contains(restaurant3.restaurant_name);

    cy.get(
      `[data-testid="expand-restaurantID-${restaurant1.restaurant_id}"]`,
    ).click();

    cy.contains(restaurant1.street_address);
    cy.contains(restaurant1.phone_number);
    cy.contains(restaurant1.cuisine);
    cy.contains("Visit Official Website");

    cy.contains("button", /close/i).click();
  });
});

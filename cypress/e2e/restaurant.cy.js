describe("Showing Restaurants", () => {
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

  it("shows restaurants from the server and displays correct details", () => {
    cy.intercept("POST", "/api/get-restaurants", [restaurant2, restaurant3]);
    cy.visit("/Restaurant");

    cy.contains(restaurant2.restaurant_name).should("be.visible");
    cy.contains(restaurant3.restaurant_name).should("be.visible");
  });
});

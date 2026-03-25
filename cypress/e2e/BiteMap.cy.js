describe("Interactive BiteMap", () => {
  const mapRestaurant1 = {
    id: 1,
    name: "Campus Pizza",
    lat: 43.47261643699509,
    lng: -80.53802660322124,
  };

  const mapRestaurant2 = {
    id: 2,
    name: "Lazeez Shawarma",
    lat: 43.47256626243004,
    lng: -80.53871520137221,
  };

  const mapRestaurant3 = {
    id: 3,
    name: "Sweet Dreams Teashop",
    lat: 43.47205285544373,
    lng: -80.5391882849798,
  };

  it("loads the map, displays markers, and opens the details popup", () => {
    cy.intercept("GET", "/api/map/restaurants", [
      mapRestaurant1,
      mapRestaurant2,
      mapRestaurant3,
    ]).as("getMapRestaurants");

    cy.visit("/BiteMap");
    cy.wait("@getMapRestaurants");

    // checks if leaflet map rendered
    cy.get(".leaflet-container").should("be.visible");

    // check that 3 markers were seen on the map and
    cy.get(".leaflet-marker-icon").should("have.length", 3);
    cy.get(".leaflet-marker-icon").first().click({ force: true });

    // check if popup opened and contains the correct data
    cy.get(".leaflet-popup").should("be.visible");
    cy.contains(".restaurant-popup h4", mapRestaurant1.name).should(
      "be.visible",
    );
    cy.contains("button", "View Full Details").click();

    cy.get('[role="dialog"]').should("be.visible");
  });
});

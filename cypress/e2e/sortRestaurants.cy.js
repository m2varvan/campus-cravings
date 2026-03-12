describe("Filtering and Sorting Restaurants", () => {
  const restaurant1 = {
    restaurant_id: 1,
    restaurant_name: "Hakka Nation",
    cuisine: "Chinese / Indian",
  };

  const restaurant2 = {
    restaurant_id: 2,
    restaurant_name: "Kabob Hut",
    cuisine: "Persian",
  };

  const restaurant3 = {
    restaurant_id: 3,
    restaurant_name: "Izna Poke Plus",
    cuisine: "Japanese",
  };

  const restaurants = [restaurant1, restaurant2, restaurant3];

  const ratings = [
    {
      restaurant_id: 1,
      avg_taste_rating: 5,
      avg_portion_rating: 5,
      avg_value_rating: 5,
      total_ratings: 1,
    },
    {
      restaurant_id: 2,
      avg_taste_rating: 2,
      avg_portion_rating: 2,
      avg_value_rating: 2,
      total_ratings: 1,
    },
    {
      restaurant_id: 3,
      avg_taste_rating: 4,
      avg_portion_rating: 4,
      avg_value_rating: 4,
      total_ratings: 1,
    },
  ];

  const hours = [
    {
      restaurantID: 1,
      dayOfWeek: "Monday",
      startTimes: ["00:00"],
      endTimes: ["23:59"],
    },
  ];

  beforeEach(() => {
    cy.intercept("GET", "**/api/get-restaurants", restaurants).as("getRest");
    cy.intercept("POST", "**/api/restaurant-rating", ratings).as("getRatings");
    cy.intercept("POST", "**/api/restaurant-hours", hours).as("getHours");

    cy.visit("/Restaurant");

    cy.wait("@getRest");
    cy.wait("@getRatings");
    cy.wait("@getHours");

    cy.contains("Hakka Nation", { timeout: 10000 }).should("be.visible");
  });

  it("Filters restaurants by restaurant name", () => {
    cy.contains(restaurant1.restaurant_name);
    cy.contains(restaurant2.restaurant_name);
    cy.contains(restaurant3.restaurant_name);

    cy.get('[data-testid="restaurant-filter"]').click();
    cy.get('li[data-value="Kabob Hut"]').click();
    cy.get("body").type("{esc}");

    cy.contains(restaurant2.restaurant_name).should("be.visible");
    cy.contains(restaurant1.restaurant_name).should("not.exist");
    cy.contains(restaurant3.restaurant_name).should("not.exist");
  });

  it("Sorts restaurants by rating (highest first)", () => {
    cy.get('[data-testid="rating-sort"]').click();
    cy.get('li[data-value="overall"]').click();

    cy.get("h6").then(($names) => {
      const restaurantNames = [...$names].map((name) => name.innerText);
      expect(restaurantNames[0]).to.contain(restaurant1.restaurant_name); 
      expect(restaurantNames[1]).to.contain(restaurant3.restaurant_name); 
      expect(restaurantNames[2]).to.contain(restaurant2.restaurant_name); 
    });
  });
});

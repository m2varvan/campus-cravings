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

  beforeEach(() => {
    cy.intercept("POST", "**/api/get-restaurants", restaurants).as("getRest");
    cy.intercept("POST", "**/api/restaurant-rating", ratings).as("getRatings");
    cy.intercept("POST", "**/api/restaurant-hours", []).as("getHours");

    cy.visit("/Restaurant");

    cy.wait(["@getRest", "@getRatings", "@getHours"]);
    cy.contains(restaurant1.restaurant_name, { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("Sorts restaurants by rating (highest first)", () => {
    cy.contains("label", "Sort By").parent().click();

    cy.get('li[role="option"]').contains("Overall Rating").click();

    cy.get("h6").then(($names) => {
      const restaurantNames = [...$names].map((name) => name.innerText);
      expect(restaurantNames[0]).to.contain(restaurant1.restaurant_name);
      expect(restaurantNames[1]).to.contain(restaurant3.restaurant_name);
      expect(restaurantNames[2]).to.contain(restaurant2.restaurant_name);
    });
  });
});

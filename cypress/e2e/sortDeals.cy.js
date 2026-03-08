describe("Filtering and Sorting Deals", () => {

  const deal1 = {
    dealID: 1,
    dealName: "Lunch Special",
    dealPrice: "10.99",
    restaurantName: "Hakka Nation",
    dayOfWeek: "Monday",
    dealTasteRating: 5,
    dealPortionRating: 5,
    dealValueRating: 5,
    numRatings: 5
  };

  const deal2 = {
    dealID: 2,
    dealName: "Sandwhich Specials",
    dealPrice: "15.00",
    restaurantName: "Sweet Dreams Teashop",
    dayOfWeek: "Monday",
    dealTasteRating: 2,
    dealPortionRating: 2,
    dealValueRating: 2,
    numRatings: 5
  };

  const deal3 = {
    dealID: 3,
    dealName: "Promo Special",
    dealPrice: "9.99",
    restaurantName: "Hakka Nation",
    dayOfWeek: "Monday",
    dealTasteRating: 4,
    dealPortionRating: 4,
    dealValueRating: 4,
    numRatings: 5
  };

  const deals = [deal1, deal2, deal3];

  beforeEach(() => {
    cy.intercept("GET", "/api/today/deals", deals);
    cy.visit("/");
  });

  it("Filters deals by restaurant name", () => {

    cy.contains(deal1.dealName);
    cy.contains(deal2.dealName);
    cy.contains(deal3.dealName);

    cy.get('[data-testid="restaurant-filter"]').select("Hakka Nation");

    cy.contains(deal1.dealName);
    cy.contains(deal3.dealName);

    cy.contains(deal2.dealName).should("not.exist");
  });


  it("Sorts deals by rating (highest first)", () => {

    cy.get('[data-testid="rating-sort"]').select(/Highest to Lowest/i);

    cy.get('[data-cy="deal-card"]').then(($cards) => {

      const dealNames = [...$cards].map(card =>
        card.innerText
      );

      expect(dealNames[0]).to.contain("Lunch Special"); // rating 5
      expect(dealNames[1]).to.contain("Promo Special"); // rating 4
      expect(dealNames[2]).to.contain("Sandwhich Specials"); // rating 2
    });

  });

});
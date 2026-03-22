

describe('UserRating', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('uuid', testUserId);
    });
  });

  it('should display the user ratings section on the profile page', () => {
    cy.visit('/User');
    cy.contains('My Ratings').should('exist');
  });

  it('should display empty state when user has no ratings', () => {
    cy.intercept('POST', '/api/user/rated/deals', mockRatings).as('getRatings');
    cy.visit('/User');
    cy.wait('@getRatings');
    cy.contains('No ratings submitted.').should('exist');
  });

  it('should display ratings with deal and restaurant names', () => {
    const mockRatings = [
      {
        ratingID: 'rating-1',
        dealID: 'deal-1',
        dealName: 'Half Off Pizza',
        restaurantName: 'Pizza Palace',
        userTasteRating: 4,
        userValueRating: 5,
        userPortionRating: 3
      }
    ];

    cy.intercept('POST', '/api/user/rated/deals', mockRatings).as('getRatings');
    cy.visit('/User');
    cy.wait('@getRatings');
   
    
    cy.contains(/Half Off Pizza/i).should('exist');
    cy.contains(/Pizza Palace/i).should('exist');
  });

  it('should display correct number of ratings', () => {
    const mockRatings = [
      {
        ratingID: 'rating-1',
        dealID: 'deal-1',
        dealName: 'Deal 1',
        restaurantName: 'Restaurant 1',
        userTasteRating: 4,
        userValueRating: 5,
        userPortionRating: 3
      },
      {
        ratingID: 'rating-2',
        dealID: 'deal-2',
        dealName: 'Deal 2',
        restaurantName: 'Restaurant 2',
        userTasteRating: 3,
        userValueRating: 4,
        userPortionRating: 4
      }
    ];

    cy.intercept('POST', '/api/user/rated/deals', mockRatings).as('getRatings');
    cy.visit('/User');
    cy.wait('@getRatings');
    
    cy.contains(/Deal 1/i).should('exist');
    cy.contains(/Deal 2/i).should('exist');
  });

  

  it('should show more ratings when Show More is clicked', () => {
      const mockRatings = Array.from({ length: 5 }, (_, i) => ({
        ratingID: `rating-${i + 1}`,
        dealID: `deal-${i + 1}`,
        dealName: `Deal ${i + 1}`,
        restaurantName: `Restaurant ${i + 1}`,
        userTasteRating: 4,
        userValueRating: 5,
        userPortionRating: 3
      }));

      cy.intercept('POST', '/api/user/rated/deals', mockRatings).as('getRatings');
      cy.visit('/User');
      cy.wait('@getRatings');
      

      cy.contains(/Deal 4/).should('not.exist');
      cy.contains('button', /Show More/i).click();
      cy.contains(/Deal 4/i).should('exist');
      cy.contains(/Deal 5/i).should('exist');
      cy.contains('(5 ratings)').should('exist');
    });
});
    

  

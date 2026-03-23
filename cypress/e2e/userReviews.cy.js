describe('User Reviews', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('uuid', testUserId);
    });
  });

  it('should display the user reviews section on the profile page', () => {
    cy.visit('/User');
    cy.contains('My Reviews').should('exist');
  });

  // it('should display reviews with title, body, and restaurant', () => {
  //   const mockReviews = [
  //     {
  //       review_id: 1,
  //       title: 'Great Pizza',
  //       body: 'Amazing deal!',
  //       deal_name: 'Half Off Pizza',
  //       restaurant_name: 'Pizza Palace',
  //       username: 'testuser',
  //       user_id: testUserId,
  //       created_at: '2024-01-01',
  //       edited_at: '2024-01-01'
  //     }
  //   ];

  //   cy.intercept('POST', '/api/user/reviews', mockReviews).as('getReviews')
  //   cy.visit('/User');
  //   cy.wait('@getReviews')
    
    
  //   cy.contains(/Great Pizza/i).should('exist');
  //   cy.contains(/Amazing deal!/i).should('exist');
  //   cy.contains(/Pizza Palace/i).should('exist');
  // });

  // it('should display correct number of reviews', () => {
  //   const mockReviews = [
  //     {
  //       review_id: 1,
  //       title: 'Review 1',
  //       body: 'Body 1',
  //       deal_name: 'Deal 1',
  //       restaurant_name: 'Restaurant 1',
  //       username: 'testuser',
  //       user_id: testUserId,
  //       created_at: '2024-01-01',
  //       edited_at: '2024-01-01'
  //     },
  //     {
  //       review_id: 2,
  //       title: 'Review 2',
  //       body: 'Body 2',
  //       deal_name: 'Deal 2',
  //       restaurant_name: 'Restaurant 2',
  //       username: 'testuser',
  //       user_id: testUserId,
  //       created_at: '2024-01-02',
  //       edited_at: '2024-01-02'
  //     }
  //   ];

  //   cy.intercept('POST', '/api/user/reviews', mockReviews).as('getReviews')
  //   cy.visit('/User');
  //   cy.wait('@getReviews')
    
  //   cy.contains('(2 reviews)').should('exist');
  //   cy.contains(/Review 1/i).should('exist');
  //   cy.contains(/Review 2/i).should('exist');
  //   cy.contains(/Body 1/i).should('exist');
  //   cy.contains(/Body 2/i).should('exist');
  // });

});

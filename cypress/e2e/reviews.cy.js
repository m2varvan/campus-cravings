describe('Deal Reviews', () => {

  it('allows user to submit a review and see it immediately', () => {

    cy.intercept('POST', '/api/deal/reviews', {
      statusCode: 200,
      body: []
    });

    cy.intercept('POST', '/api/add/review', {
      statusCode: 200,
      body: {
        review_id: 1,
        user_id: 'user-223',
        title: 'Cypress Review',
        body: 'This is a Cypress test review.',
        created_at_formatted: '2026-02-22 13:00'
      }
    });

    cy.visit('http://localhost:3001');

    // Expand first deal
    cy.contains('View Details').first().click();

    cy.get('input[label="Title"], input[name="Title"]').type('Cypress Review');
    cy.get('textarea').type('This is a Cypress test review.');

    cy.contains('Submit Review').click();

    cy.contains('Cypress Review').should('exist');
    cy.contains('This is a Cypress test review.').should('exist');
  });

});
describe('Admin', () => {

  const mockDeals = [
    {
      dealID: 1,
      dealName: 'Pizza Deal',
      dealPrice: 10,
      restaurantName: 'Pizza Place',
      dealDescription: 'Large pizza',
      dneCount: 1,
      inaccuratePriceCount: 0,
      inaccurateDescriptionCount: 2,
    },
    {
      dealID: 2,
      dealName: 'Burger Deal',
      dealPrice: 8,
      restaurantName: 'Burger Joint',
      dealDescription: 'Cheeseburger combo',
      dneCount: 0,
      inaccuratePriceCount: 1,
      inaccurateDescriptionCount: 0,
    },
  ];


  it('loads and displays flagged deals', () => {

    cy.intercept('GET', '/api/get/flagged/deals', mockDeals);
    cy.visit('/Admin'); 
    
    cy.contains('Admin').should('exist');
    cy.contains('Flagged Deals').should('exist');

    // Deals render
    cy.contains('Pizza Deal').should('exist');
    cy.contains('Burger Deal').should('exist');

    // Count display
    cy.contains('(2 flagged deals)').should('exist');
  });

  it('shows empty state', () => {
    cy.intercept('GET', '/api/get/flagged/deals', [])
    cy.visit('/Admin');

    cy.contains('No Flagged Deals.').should('exist');
    cy.contains('(0 flagged deals)').should('exist');
  });

  it('deletes a deal', () => {

    cy.intercept('GET', '/api/get/flagged/deals', [mockDeals[0]]);
    cy.visit('/Admin'); 

    cy.intercept('POST', '/api/delete/deal', {
      statusCode: 200,
    }).as('deleteDeal');


    cy.get('[data-cy=delete-deal-btn]').click();
    

    cy.get('[data-cy=confirm-delete-btn]').click();

    cy.wait('@deleteDeal');

    // Removed from UI
    cy.contains('Pizza Deal').should('not.exist');

    // Success message
    cy.contains(/was successfully deleted/i).should('exist');
  });

  it('clears flags for a deal', () => {
    cy.intercept('POST', '/api/clear/flags', {
      statusCode: 200,
    }).as('clearFlags');

    cy.intercept('GET', '/api/get/flagged/deals', [mockDeals[0]]);
    cy.visit('/Admin'); 

   
    cy.get('[data-cy=clear-flags-btn]').click();

    cy.get('[data-cy=confirm-remove-btn]').click();

    cy.wait('@clearFlags');

    cy.contains('Pizza Deal').should('not.exist');
    cy.contains(/Flags successfully cleared/i).should('exist');
  });

});
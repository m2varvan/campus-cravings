const loginAsOwner = () => {
  cy.visit('/Login');
  cy.get('input[type="email"]').type('muhammadvarvani@gmail.com');
  cy.get('input[type="password"]').type('Password123!');
  cy.contains('button', /login/i).click();
  // Wait for redirect to complete after Firebase login
  cy.url().should('not.include', '/Login');
};

describe('Owner Dashboard Setup', () => {

  beforeEach(() => {
    loginAsOwner();
    cy.visit('/Owner');
  });

  it('successfully creates a new deal', () => {
    cy.contains('button', /post new deal/i).click();

    cy.get('[role="combobox"]').first().click();
    cy.get('[role="option"]').first().click();

    cy.contains('label', /deal title/i).parent().find('input').type('Cypress Test Deal');
    cy.contains('label', /description/i).parent().find('textarea').first().type('Created by Cypress test');
    cy.contains('label', /price/i).parent().find('input').type('7.99');
    cy.get('input[type="date"]').first().type('2026-05-01');

    cy.contains(/^mon/i).click();

    cy.get('input[type="time"]').first().type('10:00');
    cy.get('input[type="time"]').last().type('14:00');

    cy.contains('button', /post deal/i).click();
    cy.contains(/deal posted successfully/i).should('be.visible');
  });

  it('opens the followers modal when Followers is clicked', () => {
    cy.contains(/followers/i).first().click();
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('opens the following modal when Following is clicked', () => {
    cy.contains(/following/i).first().click();
    cy.get('[role="dialog"]').should('be.visible');
  });


});
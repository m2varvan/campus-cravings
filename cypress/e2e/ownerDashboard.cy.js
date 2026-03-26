const loginAsOwner = () => {
  cy.visit('/Login');
  cy.get('input[type="email"]').type('test123456@gmail.com');
  cy.get('input[type="password"]').type('Password123!');
  cy.contains('button', /login/i).click();
  cy.url().should('not.include', '/Login');
};

describe('Owner Dashboard Setup', () => {

  beforeEach(() => {
    cy.intercept('GET', '/api/owner/deals/**').as('ownerDeals');
    loginAsOwner();
    cy.visit('/Owner');
    cy.wait('@ownerDeals', { timeout: 10000 });
  });

  it('opens the Edit Deal dialog when Edit is clicked', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.contains('Edit Deal').should('be.visible');
  });

  it('pre-populates the deal title in the Edit Deal form', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.contains('label', /deal title/i).parent().find('input').should('not.have.value', '');
  });

  it('pre-populates the price in the Edit Deal form', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.contains('label', /price/i).parent().find('input').should('not.have.value', '');
  });

  it('pre-populates the dates in the Edit Deal form', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.get('input[type="date"]').first().should('not.have.value', '');
  });

  it('pre-checks at least one day in the Edit Deal form', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.get('input[type="checkbox"]').filter(':checked').should('have.length.greaterThan', 0);
  });

  it('shows error when deal title is cleared and saved', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.contains('label', /deal title/i).parent().find('input').clear();
    cy.contains('button', /save changes/i).click();
    cy.contains(/deal title is required/i).should('be.visible');
  });

  it('shows error when description is cleared and saved', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.contains('label', /description/i).parent().find('textarea').first().clear();
    cy.contains('button', /save changes/i).click();
    cy.contains(/description is required/i).should('be.visible');
  });

  it('shows error when end date is before start date', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.get('input[type="date"]').first().clear().type('2026-05-10');
    cy.get('input[type="date"]').last().clear().type('2026-05-01');
    cy.contains('button', /save changes/i).click();
    cy.contains(/end date must be after start date/i).should('be.visible');
  });

  it('shows delete confirmation when Delete Deal is clicked', () => {
    cy.get('[data-testid="edit-deal-button"]').first().click();
    cy.contains('button', /delete deal/i).click();
    cy.contains(/are you sure you want to delete/i).should('be.visible');
    cy.contains('button', /confirm delete/i).should('be.visible');
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
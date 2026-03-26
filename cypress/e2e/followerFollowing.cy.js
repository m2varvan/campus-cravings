describe('Follower/Following Functionality', () => {
  beforeEach(() => {
    // Clear any existing state
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
    });

    // Login first
    cy.visit('/Login');
    cy.get('input[type="email"]').type('muhammadvarvani@gmail.com');
    cy.get('input[type="password"]').type('Password123!');
    cy.contains('button', 'Login').click();
    cy.url({ timeout: 5000 }).should('eq', Cypress.config().baseUrl + '/');
  });

  it('displays Follow button on user profile', () => {
    // Visit a user profile
    cy.visit('/User?id=2');

    // Check that Follow button is visible
    cy.contains('button', 'Follow').should('be.visible');
  });

  it('displays Follow button on owner profile', () => {
    // Visit an owner profile
    cy.visit('/Owner?id=3');

    // Check that Follow button is visible
    cy.contains('button', 'Follow').should('be.visible');
  });

  it('displays followers and following counts on user profile', () => {
    // Visit a user profile
    cy.visit('/User?id=2');

    // Check that followers and following counts are displayed
    cy.contains('Followers').should('be.visible');
    cy.contains('Following').should('be.visible');
  });

  it('displays followers and following counts on owner profile', () => {
    // Visit an owner profile
    cy.visit('/Owner?id=3');

    // Check that followers and following counts are displayed
    cy.contains('Followers').should('be.visible');
    cy.contains('Following').should('be.visible');
  });

  it('does not show follow button on own user profile', () => {
    // Visit own profile
    cy.visit('/User');

    // Follow button should not be visible
    cy.contains('button', 'Follow').should('not.exist');
    cy.contains('button', 'Unfollow').should('not.exist');
  });

  it('does not show follow button on own owner profile', () => {
    // Visit own owner profile
    cy.visit('/Owner');

    // Follow button should not be visible
    cy.contains('button', 'Follow').should('not.exist');
    cy.contains('button', 'Unfollow').should('not.exist');
  });
});

// SignUp.cy.js
describe('Sign Up Flow', () => {
    it("Signs up successfully and redirects to login", () => {
        // Mock the signup API
        cy.intercept('POST', '**/api/signup', {
            statusCode: 200,
            body: "User has been created."
        }).as('signupRequest');

        cy.visit('/signup');

        // Fill out the form
        cy.get('#firstname-input').type('Mary');
        cy.get('#lastname-input').type('Johnson');
        cy.get('#email-input').type('mary.johnson@example.com');
        cy.get('#username-input').type('MaryJ2026');
        cy.get('#password-input').type('Password1');
        cy.get('label').contains('Confirm Password').parent().find('input').type('Password1');

        // Submit
        cy.get('#submit-button').click();

        // Wait for API request
        cy.wait('@signupRequest');

        // Check confirmation message
        cy.contains('Your account has been created!! Redirecting to login...').should('be.visible');

        // Check URL redirection after 3 seconds
        cy.url({ timeout: 5000 }).should('eq', Cypress.config().baseUrl + '/Login');
    });

    it("Shows validation errors for invalid inputs", () => {
        cy.visit('/signup');

        // Submit empty form
        cy.get('#submit-button').click();

        // Check for required field errors
        cy.contains('Enter a first name').should('be.visible');
        cy.contains('Enter a last name').should('be.visible');
        cy.contains('Enter an email address').should('be.visible');
        cy.contains('Enter a username').should('be.visible');
        cy.contains('Enter a password').should('be.visible');
        cy.contains('Confirm your password').should('be.visible');

        // Enter invalid email and password
        cy.get('#email-input').type('not-an-email');
        cy.get('#username-input').type('short');
        cy.get('#password-input').type('pass');
        cy.get('input[placeholder="Confirm Password"], input[type="password"]').last().type('pass');

        cy.get('#submit-button').click();

        cy.contains('Enter a valid email address').should('be.visible');
        cy.contains('Username must be at least 8 characters').should('be.visible');
        cy.contains('Password must be at least 8 characters, include 1 uppercase letter and 1 number').should('be.visible');
    });
});
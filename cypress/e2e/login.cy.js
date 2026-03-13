describe('Login Flow', () => {

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.window().then((win) => {
            win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
        });
    });

    it("Logs in successfully and redirects", () => {

        cy.visit('/Login');

        cy.get('input[type="email"]').type('muhammadvarvani@gmail.com');
        cy.get('input[type="password"]').type('Password123!');

        cy.contains('button', 'Login').click();

        cy.contains('Login successful! Redirecting...').should('be.visible');

        cy.url({ timeout: 5000 }).should('eq', Cypress.config().baseUrl + '/');
    });

    it("sends password reset email when valid email is entered", () => {
        cy.visit('/Login');
        cy.get('input[type="email"]').type('muhammadvarvani@gmail.com');
        cy.contains('button', 'Forgot Password?').click();
        cy.contains('Password reset email sent! Check your inbox.').should('be.visible');
    });

    it("shows error when forgot password clicked with no email", () => {
        cy.visit('/Login');
        cy.contains('button', 'Forgot Password?').click();
        cy.contains('Please enter your email address first.').should('be.visible');
    });
});
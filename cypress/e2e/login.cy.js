describe('Login Flow', () => {
    it("Logs in successfully and redirects", () => {
        cy.intercept('POST', '**/api/login', {
            statusCode: 200, 
            body: {
                message: 'Login successful.',
                profilePhoto: 'MV',
                uuid: 'user-123'
            }
        }).as('loginRequest')

        cy.visit('/login');

        cy.get('input[type="email"]').type('test@gmail.com');

        cy.get('input[type="password"]').type('Mperson123');

        cy.contains('button', 'Login').click();

        cy.wait('@loginRequest');

        cy.contains('Login successful! Redirecting...').should('be.visible');

        cy.url({ timeout: 5000 }).should('eq', Cypress.config().baseUrl + '/');
    });
});
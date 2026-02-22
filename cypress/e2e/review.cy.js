describe('Submitting a review', () => {

    it('Blocks submission if not logged in', () => {

        cy.visit('/');
        cy.contains("Today's Deals");
        cy.contains("Lunch Special").click();
        cy.contains("Submit Review").click();
        cy.contains("You must be logged in");
    });

});
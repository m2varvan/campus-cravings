describe("Sign Up Flow", () => {
  it("Shows validation errors for invalid inputs", () => {
    cy.visit("/SignUp");
    cy.get("button").contains("Create Account").click();

    cy.contains("Enter a first name").should("exist");
    cy.contains("Enter a last name").should("exist");
    cy.contains("Enter an email address").should("exist");
    cy.contains("Enter a username").should("exist");
    cy.contains("Enter a password").should("exist");
    cy.contains("Confirm your password").should("exist");
  });
});

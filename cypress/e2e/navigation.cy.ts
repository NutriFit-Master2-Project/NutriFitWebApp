describe("Navigation Tests", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("should navigate from home to sign in page", () => {
        cy.get('a[href="/auth/sign-in"]').first().click();
        cy.url().should("include", "/auth/sign-in");
        cy.get("h1").should("contain", "Connexion");
    });

    it("should navigate from home to sign up page", () => {
        cy.get('a[href="/auth/sign-up"]').first().click();
        cy.url().should("include", "/auth/sign-up");
        cy.get("h1").should("contain", "Inscription");
    });

    it("should navigate between sign in and sign up pages", () => {
        // Navigate to sign in first
        cy.visit("/auth/sign-in");

        // Go to sign up from sign in
        cy.get('a[href="/auth/sign-up"]').click();
        cy.url().should("include", "/auth/sign-up");
        cy.get("h1").should("contain", "Inscription");

        // Go back to sign in from sign up
        cy.get('a[href="/auth/sign-in"]').click();
        cy.url().should("include", "/auth/sign-in");
        cy.get("h1").should("contain", "Connexion");
    });
});

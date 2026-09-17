import testData from "../fixtures/testData.json";

describe("Login Tests", () => {
  // Global error logging for every failed test
  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const title = this.currentTest.title;
      const err = this.currentTest.err;
      cy.logError(
        "Login Tests",
        err || new Error("Test failed with no error object"),
        title
      );
    }
  });

  testData.forEach(({ username, password, expected }) => {
    it(`Login Test for ${expected} credentials: ${username}`, () => {
      cy.log(`Starting login test for [${expected}] user: ${username}`);

      cy.login(username, password);

      if (expected === "valid") {
        // Valid credentials should reach the dashboard
        cy.get(".oxd-topbar-header-breadcrumb-module", { timeout: 15000 })
          .should("be.visible")
          .and("contain.text", "Dashboard")
          .then(($el) => {
            if ($el && $el.length) {
              cy.log(`Valid login successful for: ${username}`);
            } else {
              cy.logError(
                username,
                new Error("Dashboard not visible after valid login"),
                "Login Verification"
              );
            }
          });
      } else {
        // Invalid credentials should show error
        cy.get(".oxd-alert-content--error", { timeout: 10000 })
          .should("be.visible")
          .then(($el) => {
            cy.log(`Login error shown for [${username}]: ${$el.text()}`);
          });
      }
    });
  });
});

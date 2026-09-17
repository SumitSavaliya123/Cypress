Cypress.Commands.add("login", (username, password) => {
  cy.visit("/web/index.php/auth/login");
  cy.get('input[name="username"]').should("be.visible").clear().type(username);
  cy.get('input[name="password"]').should("be.visible").clear().type(password);
  cy.get('button[type="submit"].orangehrm-login-button').click();
});

Cypress.Commands.add("logout", () => {
  cy.get(".oxd-userdropdown-tab")
    .should("be.visible")
    .click()
    .then(($el) => {
      if (!$el.length) {
        cy.task("logError", {
          username: "logout",
          message: "User dropdown not found — logout may have failed",
          stack: "No stack trace (assertion check)",
        });
      }
    });
  cy.contains("a", "Logout").click();
});

Cypress.Commands.add("logError", (username, error, context = "") => {
  const message = error?.message || String(error) || "No message";
  const stack = error?.stack || "No stack trace";
  const label = context ? `[${context}] ` : "";

  cy.log(`${label}Error for [${username}]: ${message}`);
  cy.task("logError", {
    username,
    message: label ? `${label}${message}` : message,
    stack,
  });
});

Cypress.Commands.add(
  "assertVisible",
  (selector, label = selector, username = "Unknown") => {
    cy.get(selector, { timeout: 10000 })
      .should("be.visible")
      .then(($el) => {
        if (!$el || !$el.length) {
          cy.task("logError", {
            username,
            message: `assertVisible failed — "${label}" not visible (${selector})`,
            stack: "No stack trace (assertion check)",
          });
        }
      });
  },
);

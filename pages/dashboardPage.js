export class DashboardPage {
  get dashboardTitle() {
    return cy.get(".oxd-topbar-header-breadcrumb-module", { timeout: 15000 });
  }


  isDashboardVisible(username = "Unknown User") {
    cy.log(`Verifying dashboard is visible for: ${username}`);
    this.dashboardTitle
      .should("be.visible")
      .and("contain.text", "Dashboard")
      .then(($el) => {
        if (!$el || !$el.length) {
          cy.task("logError", {
            username,
            message:
              "isDashboardVisible failed — Dashboard title not found or not visible",
            stack: "No stack trace (assertion check)",
          });
        } else {
          cy.log(`Dashboard visible for: ${username}`);
        }
      });
  }
}

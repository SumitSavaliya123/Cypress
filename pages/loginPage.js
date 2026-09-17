export class LoginPage {
  // ── Selectors ──────────────────
  get usernameField() {
    return cy.get('input[name="username"]');
  }
  get passwordField() {
    return cy.get('input[name="password"]');
  }
  get submitButton() {
    return cy.get('button[type="submit"].orangehrm-login-button');
  }
  get errorMessage() {
    return cy.get(".oxd-alert-content--error");
  }
  get dashboardTitle() {
    return cy.get(".oxd-topbar-header-breadcrumb-module");
  }
  get userDropdown() {
    return cy.get(".oxd-userdropdown-tab");
  }
  get logoutOption() {
    return cy.contains("a", "Logout");
  }

  // ── Actions ────────────────

  goto() {
    cy.visit("/web/index.php/auth/login");
  }

  login(username, password) {
    this.usernameField.should("be.visible").clear().type(username);
    this.passwordField.should("be.visible").clear().type(password);
    this.submitButton.click();
  }

  isLoginSuccessful() {
    return cy
      .get(".oxd-topbar-header-breadcrumb-module", { timeout: 10000 })
      .should("be.visible")
      .then(() => true)
      .catch(() => false);
  }

  getErrorMessage() {
    return cy
      .get(".oxd-alert-content--error", { timeout: 10000 })
      .invoke("text");
  }

  logout() {
    this.userDropdown.should("be.visible").click();
    cy.wait(500);
    this.logoutOption.click();
    cy.wait(1000);
  }

}

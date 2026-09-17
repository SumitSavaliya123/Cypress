import { DashboardPage } from "../../pages/dashboardPage.js";
import testData from "../fixtures/testData.json";

describe("Logout Tests", () => {
  //Global error logging
  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const title = this.currentTest.title;
      const err = this.currentTest.err;
      cy.logError(
        "Logout Tests",
        err || new Error("Test failed with no error object"),
        title
      );
    }
  });

  it("User Login and Logout", () => {
    const dashboardPage = new DashboardPage();
    const creds =
      (Array.isArray(testData) &&
        testData.find((c) => c.expected === "valid")) ||
      testData[0];

    // Login with valid credentials via custom command
    cy.log(`Step: Login as ${creds.username}`);
    cy.login(creds.username, creds.password);

    // Verify dashboard is visible
    dashboardPage.isDashboardVisible(creds.username);

    // Verify the user dropdown is visible
    cy.assertVisible(".oxd-userdropdown-tab", "User Dropdown", creds.username);
    cy.logout();

    // Verify back at the login page
    cy.assertVisible('input[name="username"]', "Username Field", creds.username);
  });
});

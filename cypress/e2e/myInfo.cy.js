import { DashboardPage } from "../../pages/dashboardPage.js";
import { MyInfoPage } from "../../pages/myInfoPage.js";
import testData from "../fixtures/testData.json";

describe("My Info Page Flow", () => {
  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const title = this.currentTest.title;
      const err = this.currentTest.err;
      cy.logError(
        "My Info Tests",
        err || new Error("Test failed with no error object"),
        title
      );
    }
  });

  it("Login → My Info → Verify fields → Save Form", () => {
    const dashboardPage = new DashboardPage();
    const myInfoPage = new MyInfoPage();

    const creds =
      (Array.isArray(testData) &&
        testData.find((c) => c.expected === "valid")) ||
      testData[0];

    cy.login(creds.username, creds.password);

    // Verify dashboard
    cy.log("Step: Verify dashboard is visible");
    dashboardPage.isDashboardVisible(creds.username);

    cy.log("Step: Navigate to My Info");
    myInfoPage.openMyInfoMenu(creds.username);

    cy.log("Step: Verify Personal Details heading");
    myInfoPage.personalDetailsHeading.should("be.visible");

    cy.log("Clear all fields in Form and check validation");
    myInfoPage.saveForm(creds.username);
  });
});

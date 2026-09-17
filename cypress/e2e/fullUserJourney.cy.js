import { DashboardPage } from "../../pages/dashboardPage.js";
import { MyInfoPage } from "../../pages/myInfoPage.js";
import testData from "../fixtures/testData.json";

const validUser =
  (Array.isArray(testData) &&
    testData.find((entry) => entry.expected === "valid")) ||
  testData[0];

const invalidUser = (Array.isArray(testData) &&
  testData.find((entry) => entry.expected === "invalid")) || {
  username: "InvalidUser",
  password: "InvalidPassword",
  expected: "invalid",
};

describe("OrangeHRM Demo Suite", () => {
  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const title = this.currentTest.title;
      const err = this.currentTest.err;
      cy.logError(
        validUser.username || "Unknown User",
        err || new Error("Test failed with no error object"),
        title
      );
    }
  });

  it("shows validation when invalid login credentials are used", () => {
    cy.log("login with invalid credentials");
    cy.login(invalidUser.username, invalidUser.password);

    cy.log("assert the error message is displayed");
    cy.get(".oxd-alert-content--error", { timeout: 15000 })
      .should("be.visible")
      .and("contain.text", "Invalid credentials");

    cy.log("Confirm user remains on the login page");
    cy.assertVisible('input[name="username"]', "Username Field", invalidUser.username);
    cy.assertVisible('input[name="password"]', "Password Field", invalidUser.username);
  });

  it("logs in successfully and lands on the dashboard", () => {
    const dashboardPage = new DashboardPage();

    cy.log(`Login as ${validUser.username}`);
    cy.login(validUser.username, validUser.password);

    cy.log("Verify dashboard page is displayed");
    dashboardPage.isDashboardVisible(validUser.username);

    cy.log("Confirm the dashboard UI is ready");
    cy.assertVisible(
      ".oxd-topbar-header-breadcrumb-module",
      "Dashboard Breadcrumb",
      validUser.username
    );
    cy.assertVisible(
      ".oxd-topbar-header-title",
      "Dashboard Title",
      validUser.username
    );
  });

  it("updates the employee personal details in My Info", () => {
    const myInfoPage = new MyInfoPage();

    cy.log(`Login as ${validUser.username}`);
    cy.login(validUser.username, validUser.password);
    myInfoPage.openMyInfoMenu(validUser.username);

    cy.log("Verify Personal Details section is visible");
    myInfoPage.personalDetailsHeading.should("be.visible");

    cy.log("fill the form with valid employee data and save");
    myInfoPage.saveForm(validUser.username);
  });

  it("completes the full end-to-end user flow from login to logout", () => {
    const dashboardPage = new DashboardPage();
    const myInfoPage = new MyInfoPage();

    cy.log(`Login as ${validUser.username}`);
    cy.login(validUser.username, validUser.password);

    cy.log("Validate dashboard is accessible");
    dashboardPage.isDashboardVisible(validUser.username);

    cy.log("Navigate to My Info");
    myInfoPage.openMyInfoMenu(validUser.username);
    myInfoPage.personalDetailsHeading.should("be.visible");

    cy.log("Update the personal details form");
    myInfoPage.saveForm(validUser.username);

    cy.log("Logout and verify the login page appears");
    cy.logout();
    cy.assertVisible('input[name="username"]', "Username Field", validUser.username);
    cy.assertVisible('input[name="password"]', "Password Field", validUser.username);
  });
});

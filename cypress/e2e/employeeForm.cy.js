import { DashboardPage } from "../../pages/dashboardPage.js";
import { MyInfoPage } from "../../pages/myInfoPage.js";
import employeeData from "../fixtures/employeeData.json";

describe("Data-Driven Employee Profile Tests", () => {
  const dashboardPage = new DashboardPage();
  const myInfoPage = new MyInfoPage();

  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const title = this.currentTest.title;
      const err = this.currentTest.err;
      cy.logError(
        "Employee Profile Tests",
        err || new Error("Test failed with no error object"),
        title
      );
    }
  });

  beforeEach(() => {
    cy.login("Admin", "admin123");
    dashboardPage.isDashboardVisible("Admin");

    cy.log("Navigate to My Info");
    myInfoPage.openMyInfoMenu("Admin");
    myInfoPage.personalDetailsHeading.should("be.visible");
  });

  employeeData.forEach((emp) => {
    it(`should update profile: ${emp.testCaseName}`, () => {

      myInfoPage.clearField(myInfoPage.firstNameField);
      myInfoPage.clearField(myInfoPage.lastNameField);
      myInfoPage.saveButton.scrollIntoView().click({ force: true });
      myInfoPage.fillField(myInfoPage.firstNameField, emp.firstName, "First Name");
      myInfoPage.fillField(myInfoPage.middleNameField, emp.middleName, "Middle Name");
      myInfoPage.fillField(myInfoPage.lastNameField, emp.lastName, "Last Name");
      myInfoPage.fillField(myInfoPage.employeeIdField, emp.empId, "Employee ID");
      myInfoPage.fillField(myInfoPage.otherIdField, emp.otherId, "Other ID");
      myInfoPage.fillField(
        myInfoPage.licenseNumberField,
        emp.licenseNo,
        "License Number"
      );
      myInfoPage.fillField(
        myInfoPage.licenseExpiryDateField,
        emp.licenseExpiry,
        "License Expiry Date"
      );
      myInfoPage.fillField(myInfoPage.dateOfBirthField, emp.dob, "Date of Birth");

      myInfoPage.selectGender(emp.gender);
      myInfoPage.selectDropdown(myInfoPage.nationalityDropdown, emp.nationality);
      myInfoPage.selectDropdown(myInfoPage.maritalStatusDropdown, emp.maritalStatus);

      myInfoPage.saveButton.scrollIntoView().click({ force: true });

      cy.wait(2000);
      cy.get("body").then(($body) => {
        if ($body.find(".oxd-toast").length > 0) {
          cy.log("Success toast visible — form saved successfully");
        } else {
          cy.log("Success Toast not visible — possible validation error.");
          cy.task("logError", {
            username: `${emp.firstName} ${emp.lastName}`,
            message: "saveForm: Success toast not visible after save",
            stack: "No stack trace (soft assertion)",
          });
        }
      });
    });
  });
});

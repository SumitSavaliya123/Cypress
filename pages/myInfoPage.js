export class MyInfoPage {
  // ── Selectors ──────────────────
  get myInfoMenu() {
    return cy.get('a[href="/web/index.php/pim/viewMyDetails"]');
  }

  get personalDetailsHeading() {
    return cy.contains("h6", "Personal Details");
  }

  get saveButton() {
    return cy.xpath(
      '//h6[text()="Personal Details"]/following-sibling::hr/following-sibling::form//button[@type="submit"]'
    );
  }

  get successToast() {
    return cy.get(".oxd-toast");
  }

  get attachmentHeader() {
    return cy.xpath('//h6[text()="Attachments"]');
  }

  get addButtonAttachment() {
    return cy.xpath(
      '//h6[text()="Attachments"]/following::button[.//i[contains(@class,"bi-plus")]]'
    );
  }

  get fileInputAttachment() {
    return cy.xpath('//input[@type="file"]');
  }

  get commentBoxAttachment() {
    return cy.xpath('//textarea[@placeholder="Type comment here"]');
  }

  get saveButtonAttachment() {
    return cy.xpath(
      '//h6[normalize-space()="Add Attachment"]/following-sibling::hr/following-sibling::form//button[@type="submit" and normalize-space()="Save"]'
    );
  }

  get toastMessage() {
    return cy.get("#oxd-toaster_1 .oxd-toast");
  }

  get deletePopup() {
    return cy.get('[class*="orangehrm-dialog-popup"]');
  }

  get yesDeleteButton() {
    return cy.xpath('//button[contains(.,"Yes, Delete")]');
  }

  // ── XPath field selectors (used inside methods) ──────────────────────────

  get firstNameField() {
    return cy.xpath('//input[@name="firstName"]');
  }

  get middleNameField() {
    return cy.xpath('//input[@name="middleName"]');
  }

  get lastNameField() {
    return cy.xpath('//input[@name="lastName"]');
  }

  get employeeIdField() {
    return cy.xpath(
      '//div[label[normalize-space()="Employee Id"]]/following-sibling::div//input'
    );
  }

  get otherIdField() {
    return cy.xpath(
      '//div[label[normalize-space()="Other Id"]]/following-sibling::div//input'
    );
  }

  get licenseNumberField() {
    return cy.xpath(
      '//div[label[normalize-space()="Driver\'s License Number"]]/following-sibling::div//input'
    );
  }

  get licenseExpiryDateField() {
    return cy.xpath(
      '//div[label[normalize-space()="License Expiry Date"]]/following-sibling::div//input'
    );
  }

  get dateOfBirthField() {
    return cy.xpath(
      '//div[label[normalize-space()="Date of Birth"]]/following-sibling::div//input'
    );
  }

  get radioMale() {
    return cy.xpath('//form//label[input[@value="1"]]/span').first();
  }

  get radioFemale() {
    return cy.xpath('//form//label[input[@value="2"]]/span').first();
  }

  get nationalityDropdown() {
    return cy.xpath(
      '//div[label[normalize-space()="Nationality"]]/following-sibling::div//div[contains(@class,"oxd-select-text-input")]'
    );
  }

  get maritalStatusDropdown() {
    return cy.xpath(
      '//div[label[normalize-space()="Marital Status"]]/following-sibling::div//div[contains(@class,"oxd-select-text-input")]'
    );
  }

  // ── Dynamic Selectors ─────────────

  getUploadedFile(fileName) {
    return cy.xpath(
      `//div[@role="table"]//div[contains(text(),"${fileName}")]`
    );
  }

  getDownloadButton(fileName) {
    return cy.xpath(
      `//div[text()="${fileName}"]/ancestor::div[@role="row"]//button[i[contains(@class,"bi-download")]]`
    );
  }

  getDeleteButton(fileName) {
    return cy.xpath(
      `//div[text()="${fileName}"]/ancestor::div[@role="row"]//button[i[contains(@class,"bi-trash")]]`
    );
  }

  openMyInfoMenu(username = "Unknown User") {
    cy.log(`Opening My Info menu for: ${username}`);
    this.myInfoMenu.click();
    this.personalDetailsHeading
      .should("be.visible")
      .then(($el) => {
        if (!$el || !$el.length) {
          cy.task("logError", {
            username,
            message:
              "openMyInfoMenu failed — Personal Details heading not visible after navigation",
            stack: "No stack trace (assertion check)",
          });
        } else {
          cy.log(`My Info page loaded for: ${username}`);
        }
      });
  }

  fillField(fieldChainable, value, fieldLabel) {
    cy.log(`Filling field: ${fieldLabel} = "${value}"`);
    fieldChainable
      .should("be.visible")
      .clear()
      .type(value, { delay: 30 });
    cy.wait(300);
  }

  clearField(fieldChainable) {
    fieldChainable.should("be.visible").clear();
    cy.wait(300);
  }


  selectDropdown(dropdownChainable, optionText, username = "Unknown User") {
    cy.log(`Selecting "${optionText}" from dropdown`);
    dropdownChainable.scrollIntoView().click({ force: true });
    cy.wait(300);

    cy.get('body').then(($body) => {
      const options = $body.find('div[role="option"]');
      if (options.length === 0) {
        cy.task("logError", {
          username,
          message: `selectDropdown failed — no options found when selecting "${optionText}"`,
          stack: "No stack trace (DOM check)",
        });
        cy.log(`No dropdown options found for: "${optionText}"`);
      } else {
        // force:true bypasses the fixed sticky topbar covering check
        cy.contains('div[role="option"]', optionText)
          .click({ force: true });
      }
    });
    cy.wait(300);
  }

  selectGender(genderValue) {
    cy.log(`Selecting gender: ${genderValue}`);
    if (genderValue.toLowerCase() === "male") {
      this.radioMale.scrollIntoView().click({ force: true });
    } else {
      this.radioFemale.scrollIntoView().click({ force: true });
    }
    cy.wait(300);
  }

  saveForm(username = "Unknown User") {
    cy.log(`Running saveForm() for: ${username}`);

    this.firstNameField.should("be.visible");
    this.lastNameField.should("be.visible");
    cy.wait(1000);

    this.clearField(this.firstNameField);
    this.clearField(this.lastNameField);
    this.saveButton.scrollIntoView().click({ force: true });

    const formData = {
      firstName: "Sumit",
      middleName: "Savaliya",
      lastName: "Yupp",
      empId: "Emp3869",
      otherId: "Other12345",
      licenseNo: "Lic12345",
      licenseExpiry: "2035-01-01",
      dob: "2001-12-22",
      gender: "male",
      nationality: "Indian",
      maritalStatus: "Single",
    };

    cy.log("Filling form fields one by one...");

    this.fillField(this.firstNameField, formData.firstName, "First Name");
    this.fillField(this.middleNameField, formData.middleName, "Middle Name");
    this.fillField(this.lastNameField, formData.lastName, "Last Name");
    this.fillField(this.employeeIdField, formData.empId, "Employee ID");
    this.fillField(this.otherIdField, formData.otherId, "Other ID");
    this.fillField(
      this.licenseNumberField,
      formData.licenseNo,
      "License Number"
    );
    this.fillField(
      this.licenseExpiryDateField,
      formData.licenseExpiry,
      "License Expiry Date"
    );
    this.fillField(this.dateOfBirthField, formData.dob, "Date of Birth");

    this.selectGender(formData.gender);
    this.selectDropdown(this.nationalityDropdown, formData.nationality);
    this.selectDropdown(this.maritalStatusDropdown, formData.maritalStatus);

    this.saveButton.scrollIntoView().click({ force: true });

    cy.wait(2000);
    cy.get("body").then(($body) => {
      if ($body.find(".oxd-toast").length > 0) {
        cy.log("Success toast visible — form saved successfully");
      } else {
        cy.log("Success Toast not visible — possible validation error.");
        cy.task("logError", {
          username,
          message:
            "saveForm: Success toast not visible after save — form may have a validation error",
          stack: "No stack trace (soft assertion)",
        });
      }
    });
  }
}

const { expect } = require("@playwright/test");

class PIMPage {
  constructor(page) {
    this.page = page;

    this.pimMenu = page.getByRole("link", {
      name: "PIM",
      exact: true,
    });

    this.employeeInformation = page.getByText("Employee Information", {
      exact: true,
    });

    this.addButton = page.locator(".orangehrm-header-container button").filter({ hasText: "Add" }).first();

    this.firstName = page.getByPlaceholder("First Name");
    this.middleName = page.getByPlaceholder("Middle Name");
    this.lastName = page.getByPlaceholder("Last Name");

    this.employeeIdInput = page.locator(".oxd-input-group").filter({ hasText: "Employee Id" }).locator("input").first();

    this.saveButton = page.getByRole("button", {
      name: "Save",
      exact: true,
    });

    this.personalDetails = page.getByRole("heading", {
      name: "Personal Details",
      exact: true,
    });

    this.employeeNameInput = page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employee Name" })
      .locator("input")
      .first();

    this.searchButton = page.getByRole("button", {
      name: "Search",
      exact: true,
    });

    this.resetButton = page.getByRole("button", {
      name: "Reset",
      exact: true,
    });

    this.tableRows = page.locator(".oxd-table-body .oxd-table-row");

    this.noRecordsMessage = page.getByText("No Records Found", {
      exact: true,
    });

    this.confirmDelete = page.getByRole("button", {
      name: /Yes, Delete/i,
    });

    this.successToast = page.locator(".oxd-toast--success");
    this.errorToast = page.locator(".oxd-toast--error");
    this.validationErrors = page.locator(".oxd-input-field-error-message");
  }

  async open() {
    if (!this.page.url().includes("/pim/viewEmployeeList")) {
      await this.pimMenu.click();

      await this.page.waitForURL(/\/pim\/viewEmployeeList/, {
        timeout: 20000,
      });
    }

    await expect(this.employeeInformation).toBeVisible({
      timeout: 15000,
    });

    await expect(this.addButton).toBeVisible({
      timeout: 15000,
    });
  }

  async addEmployee(first, middle, last, employeeId) {
    await this.open();
    await this.addButton.click();

    await expect(this.firstName).toBeVisible({
      timeout: 15000,
    });

    await this.firstName.fill(first);

    if (middle) {
      await this.middleName.fill(middle);
    }

    await this.lastName.fill(last);

    const generatedId = employeeId || String(Date.now()).slice(-8);

    await this.employeeIdInput.fill(generatedId);

    await expect(this.firstName).toHaveValue(first);
    await expect(this.lastName).toHaveValue(last);
    await expect(this.employeeIdInput).toHaveValue(generatedId);

    await this.saveButton.click();

    // Wait for the actual employee profile URL.
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: 30000 });

    await expect(this.personalDetails).toBeVisible({
      timeout: 15000,
    });

    return { employeeId: generatedId };
  }

  async searchEmployee(name) {
    await this.open();

    await this.employeeNameInput.fill(name);

    const suggestion = this.page.locator(".oxd-autocomplete-option").filter({ hasText: name }).first();

    await expect(suggestion).toBeVisible({
      timeout: 15000,
    });

    await suggestion.click();
    await this.searchButton.click();

    await expect(this.tableRows.first().or(this.noRecordsMessage)).toBeVisible({
      timeout: 15000,
    });
  }

  async deleteEmployeeByName(name) {
    const row = this.tableRows.filter({ hasText: name }).first();

    await expect(row).toBeVisible({
      timeout: 15000,
    });

    await row.getByRole("button").last().click();

    await expect(this.confirmDelete).toBeVisible({
      timeout: 10000,
    });

    await this.confirmDelete.click();

    await expect(this.successToast).toContainText("Successfully Deleted", { timeout: 15000 });

    await expect(this.tableRows.filter({ hasText: name })).toHaveCount(0, {
      timeout: 10000,
    });
  }
}

module.exports = { PIMPage };

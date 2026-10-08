const { expect } = require("@playwright/test");

class PIMPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.pimMenu = page.getByRole("link", { name: "PIM", exact: true });

    // PIM list page
    this.employeeInformation = page.getByText("Employee Information", {
      exact: true,
    });

    this.addButton = page.locator('button.oxd-button--secondary:has-text("Add")').first();

    // Add Employee form
    this.firstName = page.getByPlaceholder("First Name");
    this.middleName = page.getByPlaceholder("Middle Name");
    this.lastName = page.getByPlaceholder("Last Name");

    this.saveButton = page
      .getByRole("button", {
        name: "Save",
        exact: true,
      })
      .first();

    this.personalDetails = page.getByRole("heading", {
      name: "Personal Details",
      exact: true,
    });

    // Employee search
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

    // Employee table
    this.tableRows = page.locator(".oxd-table-body .oxd-table-row");

    // Toast
    this.successToast = page.locator(".oxd-toast--success");

    this.confirmDelete = page.getByRole("button", {
      name: /Yes, Delete/i,
    });
  }

  async open() {
    await this.pimMenu.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await this.pimMenu.click();

    await this.page.waitForURL(/\/pim\/viewEmployeeList/, { timeout: 30000 });

    await this.employeeInformation.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async clickAdd() {
    await this.addButton.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await expect(this.addButton).toBeEnabled();

    await this.addButton.click();

    await this.page.waitForURL(/\/pim\/addEmployee/, { timeout: 30000 });

    await this.firstName.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async enterEmployeeDetails(first, middle, last) {
    await this.firstName.fill(first);

    if (middle && (await this.middleName.count()) > 0) {
      await this.middleName.fill(middle);
    }

    await this.lastName.fill(last);
  }

  async saveEmployee() {
    await this.saveButton.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await expect(this.saveButton).toBeEnabled();

    await this.saveButton.click();

    await this.personalDetails.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async addEmployee(first, middle, last) {
    await this.open();
    await this.clickAdd();
    await this.enterEmployeeDetails(first, middle, last);
    await this.saveEmployee();
  }

  async searchEmployee(name) {
    await this.open();

    await this.employeeNameInput.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await this.employeeNameInput.fill(name);

    // Allow OrangeHRM autocomplete to appear.
    await this.page.waitForTimeout(1000);

    const option = this.page.getByRole("option").filter({ hasText: name }).first();

    if (await option.isVisible().catch(() => false)) {
      await option.click();
    }

    await this.searchButton.click();

    await this.tableRows.first().waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async deleteEmployeeByName(name) {
    const row = this.tableRows.filter({ hasText: name }).first();

    await row.waitFor({
      state: "visible",
      timeout: 30000,
    });

    const buttons = row.getByRole("button");

    const count = await buttons.count();

    if (count < 2) {
      throw new Error(`Expected edit/delete action buttons for employee: ${name}`);
    }

    // Last action button = Delete
    await buttons.last().click();

    await this.confirmDelete.waitFor({
      state: "visible",
      timeout: 15000,
    });

    await this.confirmDelete.click();

    await this.successToast.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }
}

module.exports = { PIMPage };

const { expect } = require("@playwright/test");

class PIMPage {
  constructor(page) {
    this.page = page;

    this.pimMenu = page.getByRole("link", { name: "PIM", exact: true });

    this.employeeInformation = page.getByText("Employee Information", {
      exact: true,
    });

    this.addButton = page.locator("button.oxd-button--secondary").filter({ hasText: "Add" }).first();

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

    this.tableBody = page.locator(".oxd-table-body");
    this.tableRows = this.tableBody.locator(".oxd-table-row");
    this.noRecordsMessage = page.getByText("No Records Found", {
      exact: true,
    });

    this.successToast = page.locator(".oxd-toast--success");

    this.confirmDelete = page.getByRole("button", {
      name: /Yes, Delete/i,
    });
  }

  async open() {
    await this.pimMenu.waitFor({ state: "visible", timeout: 30000 });
    await this.pimMenu.click();

    await this.page.waitForURL(/\/pim\/viewEmployeeList/, {
      timeout: 30000,
    });

    await this.employeeInformation.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async clickAdd() {
    await this.addButton.waitFor({ state: "visible", timeout: 30000 });
    await expect(this.addButton).toBeEnabled();
    await this.addButton.click();

    await this.page.waitForURL(/\/pim\/addEmployee/, {
      timeout: 30000,
    });

    await this.firstName.waitFor({ state: "visible", timeout: 30000 });
  }

  async enterEmployeeDetails(first, middle, last) {
    await this.firstName.fill(first);

    if (middle) {
      await this.middleName.fill(middle);
    }

    await this.lastName.fill(last);
  }

  async saveEmployee() {
    await this.saveButton.waitFor({ state: "visible", timeout: 30000 });
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

    const option = this.page.getByRole("option").filter({ hasText: name }).first();

    // Select a matching autocomplete suggestion when one appears.
    try {
      await option.waitFor({ state: "visible", timeout: 3000 });
      await option.click();
    } catch {
      // Some OrangeHRM versions allow submitting the typed name directly.
    }

    await this.searchButton.click();

    await this.tableBody.waitFor({
      state: "visible",
      timeout: 15000,
    });

    await expect(this.tableRows.first().or(this.noRecordsMessage)).toBeVisible({ timeout: 15000 });
  }

  async deleteEmployeeByName(name) {
    const row = this.tableRows.filter({ hasText: name }).first();

    await row.waitFor({ state: "visible", timeout: 15000 });

    const buttons = row.getByRole("button");
    const count = await buttons.count();

    if (count < 2) {
      throw new Error(`Expected edit/delete action buttons for employee: ${name}`);
    }

    await buttons.last().click();

    await this.confirmDelete.waitFor({
      state: "visible",
      timeout: 15000,
    });

    await this.confirmDelete.click();

    await this.successToast.waitFor({
      state: "visible",
      timeout: 15000,
    });
  }
}

module.exports = { PIMPage };

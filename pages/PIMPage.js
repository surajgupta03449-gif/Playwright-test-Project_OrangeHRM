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

    this.addButton = page.locator("button.oxd-button--secondary").filter({ hasText: "Add" }).first();

    this.firstName = page.getByPlaceholder("First Name");
    this.middleName = page.getByPlaceholder("Middle Name");
    this.lastName = page.getByPlaceholder("Last Name");

    this.employeeIdInput = page.locator(".oxd-input-group").filter({ hasText: "Employee Id" }).locator("input").first();

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
    if (await this.employeeInformation.isVisible().catch(() => false)) {
      return;
    }

    await this.pimMenu.waitFor({ state: "visible" });
    await this.pimMenu.click();

    await this.page.waitForURL(/\/pim\/viewEmployeeList/);
    await expect(this.employeeInformation).toBeVisible();
  }

  async clickAdd() {
    await this.addButton.waitFor({ state: "visible" });
    await this.addButton.click();

    await this.page.waitForURL(/\/pim\/addEmployee/);
    await expect(this.firstName).toBeVisible();
  }

  async enterEmployeeDetails(first, middle, last, employeeId) {
    await this.firstName.fill(first);

    if (middle) {
      await this.middleName.fill(middle);
    }

    await this.lastName.fill(last);

    // Generate an ID automatically when one is not supplied.
    const id = employeeId || `Q${Date.now().toString().slice(-9)}`;
    await this.employeeIdInput.fill(id);

    return id;
  }

  async saveEmployee() {
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeEnabled();

    // Capture the current page URL before saving.
    const previousUrl = this.page.url();

    await this.saveButton.click();

    // Wait for the application to finish processing the Save action.
    await this.page.waitForLoadState("domcontentloaded").catch(() => {});

    // Allow the application to complete its client-side request.
    await expect.poll(
      async () => {
        const currentUrl = this.page.url();
        const toastVisible = await this.successToast.isVisible().catch(() => false);
        const errorVisible = await this.page
          .locator(".oxd-input-field-error-message")
          .first()
          .isVisible()
          .catch(() => false);

        return toastVisible || errorVisible || (currentUrl !== previousUrl && /\/pim\//.test(currentUrl));
      },
      { timeout: 20000, message: "Save did not complete; inspect the form and network response." },
    );

    const validationError = this.page.locator(".oxd-input-field-error-message").first();

    if (await validationError.isVisible().catch(() => false)) {
      throw new Error(`Employee form validation failed: ${await validationError.innerText()}`);
    }

    // OrangeHRM may navigate without showing a toast.
    await expect(this.personalDetails).toBeVisible({ timeout: 10000 });
  }

  async addEmployee(first, middle, last, employeeId) {
    await this.open();
    await this.clickAdd();

    const id = await this.enterEmployeeDetails(first, middle, last, employeeId);

    await this.saveEmployee();
    return { employeeId: id };
  }

  async searchEmployee(name) {
    await this.open();
    await this.employeeNameInput.fill(name);

    const option = this.page.getByRole("option").filter({ hasText: name }).first();

    try {
      await option.waitFor({ state: "visible", timeout: 3000 });
      await option.click();
    } catch {
      // Continue if this OrangeHRM version has no matching suggestion.
    }

    await this.searchButton.click();

    await expect(this.tableRows.first().or(this.noRecordsMessage)).toBeVisible({ timeout: 15000 });
  }

  async deleteEmployeeByName(name) {
    const row = this.tableRows.filter({ hasText: name }).first();
    await row.waitFor({ state: "visible", timeout: 15000 });

    const buttons = row.getByRole("button");

    if ((await buttons.count()) < 2) {
      throw new Error(`Expected edit/delete action buttons for employee: ${name}`);
    }

    await buttons.last().click();
    await this.confirmDelete.waitFor({ state: "visible" });
    await this.confirmDelete.click();

    await expect(this.successToast).toContainText("Successfully Deleted", { timeout: 15000 });

    await expect(this.tableRows.filter({ hasText: name })).toHaveCount(0, { timeout: 10000 });
  }
}

module.exports = { PIMPage };

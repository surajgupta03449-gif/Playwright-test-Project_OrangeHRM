const { expect } = require("@playwright/test");

class AdminPage {
  constructor(page) {
    this.page = page;

    this.adminMenu = page.getByRole("link", {
      name: "Admin",
      exact: true,
    });

    this.systemUsersHeading = page.getByRole("heading", {
      name: "System Users",
      exact: true,
    });

    this.searchButton = page.getByRole("button", {
      name: "Search",
      exact: true,
    });

    this.resetButton = page.getByRole("button", {
      name: "Reset",
      exact: true,
    });

    this.records = page.locator(".oxd-table-body .oxd-table-row");

    this.noRecordsMessage = page.getByText("No Records Found", {
      exact: true,
    });
  }

  usernameInput() {
    return this.page
      .locator(".oxd-input-group")
      .filter({ hasText: /^Username$/ })
      .locator("input")
      .first();
  }

  async open() {
    // Avoid clicking Admin again if the page is already open.
    if (await this.systemUsersHeading.isVisible().catch(() => false)) {
      return;
    }

    await this.adminMenu.waitFor({ state: "visible" });
    await this.adminMenu.click();

    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/);

    await expect(this.systemUsersHeading).toBeVisible({
      timeout: 20000,
    });
  }

  async searchUser(username) {
    const input = this.usernameInput();

    await expect(input).toBeVisible();
    await input.fill(username);
    await this.searchButton.click();

    // Wait until either rows or the empty-state message appears.
    await expect(this.records.first().or(this.noRecordsMessage)).toBeVisible({ timeout: 15000 });
  }

  async reset() {
    await this.resetButton.click();
    await expect(this.usernameInput()).toHaveValue("");
  }
}

module.exports = { AdminPage };

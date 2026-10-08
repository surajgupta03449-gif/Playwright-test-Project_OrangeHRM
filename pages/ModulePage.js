const { expect } = require("@playwright/test");
const { validUser } = require("../test-data/loginData");

class ModulePage {
  constructor(page) {
    this.page = page;

    this.breadcrumb = page.locator(".oxd-topbar-header-breadcrumb").first();

    this.pageContent = page.locator(".oxd-layout-context").first();

    this.adminAccessHeading = page.getByRole("heading", {
      name: "Administrator Access",
      exact: true,
    });

    this.confirmButton = page.getByRole("button", {
      name: "Confirm",
      exact: true,
    });

    this.adminPassword = page.locator('input[type="password"]').first();
  }

  async open(name) {
    const link = this.page.getByRole("link", {
      name,
      exact: true,
    });

    await link.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await link.click();

    if (name === "Maintenance") {
      await this.adminAccessHeading.waitFor({
        state: "visible",
        timeout: 30000,
      });

      await this.adminPassword.fill(validUser.password);

      await expect(this.confirmButton).toBeEnabled();

      await this.confirmButton.click();
    }

    await this.page.waitForLoadState("domcontentloaded").catch(() => {});

    await this.breadcrumb.waitFor({
      state: "visible",
      timeout: 30000,
    });

    await expect(this.breadcrumb).toContainText(name, {
      timeout: 15000,
    });
  }
}

module.exports = { ModulePage };

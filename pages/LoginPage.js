const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", {
      name: "Login",
      exact: true,
    });

    this.dashboard = page.getByRole("heading", {
      name: "Dashboard",
      exact: true,
    });

    this.errorMessage = page.locator(".oxd-alert-content-text");

    this.requiredMessages = page.locator(".oxd-input-group__message");
  }

  async goto() {
    const loginUrl = "/web/index.php/auth/login";
    const usernameInput = this.page.getByPlaceholder("Username");

    let lastError;

    for (let attempt = 1; attempt <= 2; attempt++) {
      if (this.page.isClosed()) {
        throw new Error("Cannot open login page: the browser page is already closed.");
      }

      try {
        await this.page.goto(loginUrl, {
          waitUntil: "domcontentloaded",
          timeout: 15000,
        });

        await usernameInput.waitFor({
          state: "visible",
          timeout: 8000,
        });

        return;
      } catch (error) {
        lastError = error;

        if (this.page.isClosed()) {
          throw new Error(`Login navigation failed because the page closed: ${error.message}`);
        }

        if (attempt === 2) {
          break;
        }
      }
    }

    throw new Error(
      `Could not open the OrangeHRM login page after 2 attempts. ` +
        `Last error: ${lastError?.message || "Unknown navigation error"}`,
    );
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  // Successful login only
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();

    await this.page.waitForURL(/\/dashboard\/index/, {
      timeout: 60000,
    });

    await this.dashboard.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  // Negative/validation login attempt
  async attemptLogin(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}

module.exports = { LoginPage };

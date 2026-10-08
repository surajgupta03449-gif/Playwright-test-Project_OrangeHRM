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
    const url = "/web/index.php/auth/login";
    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await this.page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        await this.usernameInput.waitFor({
          state: "visible",
          timeout: 30000,
        });

        return;
      } catch (error) {
        lastError = error;

        if (attempt < 3) {
          await this.page.waitForTimeout(3000);
        }
      }
    }

    throw lastError;
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

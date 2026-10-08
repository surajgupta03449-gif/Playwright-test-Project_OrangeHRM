const base = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { DashboardPage } = require("../pages/DashboardPage");
const { AdminPage } = require("../pages/AdminPage");
const { PIMPage } = require("../pages/PIMPage");
const { LeavePage } = require("../pages/LeavePage");
const { MyInfoPage } = require("../pages/MyInfoPage");

const username = process.env.ORANGEHRM_USERNAME || "Admin";
const password = process.env.ORANGEHRM_PASSWORD || "admin123";

const test = base.test.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  adminPage: async ({ page }, use) => use(new AdminPage(page)),
  pimPage: async ({ page }, use) => use(new PIMPage(page)),
  leavePage: async ({ page }, use) => use(new LeavePage(page)),
  myInfoPage: async ({ page }, use) => use(new MyInfoPage(page)),
  authenticated: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(username, password);
    await page.waitForURL(/dashboard/, { timeout: 30_000 });
    await use(page);
  },
});

module.exports = { test, expect: base.expect, credentials: { username, password } };

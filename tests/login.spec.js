const { test, expect } = require("../fixtures/testFixtures");
const { LoginPage } = require("../pages/LoginPage");
const { DashboardPage } = require("../pages/DashboardPage");
const { validUser, invalidUser, emptyUser } = require("../test-data/loginData");

test.describe("Authentication", () => {
  test("TC01 - valid login", async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await login.goto();
    await login.login(validUser.username, validUser.password);

    await expect(dashboard.dashboardHeading).toBeVisible();
  });

  test("TC02 - invalid username/password", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();

    await login.attemptLogin(invalidUser.username, invalidUser.password);

    await expect(login.errorMessage).toBeVisible();
    await expect(login.errorMessage).toContainText("Invalid credentials");
  });

  test("TC03 - empty username/password validation", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();

    await login.attemptLogin(emptyUser.username, emptyUser.password);

    await expect(login.requiredMessages).toHaveCount(2);
    await expect(login.requiredMessages.first()).toHaveText("Required");
    await expect(login.requiredMessages.last()).toHaveText("Required");
  });
});

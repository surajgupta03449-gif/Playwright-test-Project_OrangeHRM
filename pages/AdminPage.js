class AdminPage {
  constructor(page) {
    this.page = page;
    this.adminMenu = page.getByRole('link', { name: 'Admin', exact: true });
    this.pageHeading = page.getByRole('heading', { name: 'Admin' });
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.records = page.locator('.oxd-table-body .oxd-table-row');
  }

  usernameInput() {
    return this.page.locator('.oxd-input-group').filter({ hasText: /^Username$/ }).locator('input').first();
  }

  async open() {
    await this.adminMenu.click();
    await this.systemUsersHeading.or(this.pageHeading).first().waitFor({ state: 'visible' });
  }

  async searchUser(username) {
    const input = this.usernameInput();
    await input.waitFor({ state: 'visible' });
    await input.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async reset() {
    await this.resetButton.click();
  }
}

module.exports = { AdminPage };

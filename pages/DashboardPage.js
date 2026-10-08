class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' }).or(page.getByText('Logout', { exact: true })).first();
  }
  async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
  }
}
module.exports = { DashboardPage };

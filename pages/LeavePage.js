class LeavePage {
  constructor(page) {
    this.page = page;
    this.leaveMenu = page.getByText('Leave', { exact: true }).first();
    this.leaveHeading = page.getByRole('heading', { name: 'Leave List' });
    this.applyLeaveLink = page.getByText('Apply', { exact: true }).first();
    this.myLeaveLink = page.getByText('My Leave', { exact: true }).first();
  }
  async open() { await this.leaveMenu.click(); await this.leaveHeading.waitFor({ state: 'visible' }); }
}
module.exports = { LeavePage };

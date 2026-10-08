class EmployeePage {
  constructor(page) {
    this.page = page;
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.saveButtons = page.getByRole('button', { name: 'Save' });
    this.successToast = page.locator('.oxd-toast--success');
  }
  async verifyPersonalDetails() { await this.personalDetailsHeading.waitFor({ state: 'visible' }); }
}
module.exports = { EmployeePage };

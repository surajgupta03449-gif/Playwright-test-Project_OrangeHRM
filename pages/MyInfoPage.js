class MyInfoPage {
  constructor(page) {
    this.page = page;
    this.myInfoMenu = page.getByRole('link', { name: 'My Info', exact: true });
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.saveButtons = page.getByRole('button', { name: 'Save', exact: true });
  }
  async open() {
    await this.myInfoMenu.click();
    await this.personalDetailsHeading.waitFor({ state: 'visible' });
  }
}
module.exports = { MyInfoPage };

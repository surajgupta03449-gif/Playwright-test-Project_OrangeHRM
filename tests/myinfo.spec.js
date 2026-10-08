const { test, expect } = require('../fixtures/testFixtures');
const { MyInfoPage } = require('../pages/MyInfoPage');

test('TC08 - My Info: open and verify personal details form', async ({ authenticated }) => {
  const myInfo = new MyInfoPage(authenticated);
  await myInfo.open();
  await expect(myInfo.personalDetailsHeading).toBeVisible();
  await expect(myInfo.saveButtons.first()).toBeVisible();
});

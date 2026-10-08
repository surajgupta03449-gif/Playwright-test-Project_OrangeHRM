const { test, expect, credentials } = require('../fixtures/testFixtures');
const { AdminPage } = require('../pages/AdminPage');

test('TC05 - Admin: open module, search Admin user, and verify result', async ({ authenticated }) => {
  const admin = new AdminPage(authenticated);
  await admin.open();
  await expect(admin.systemUsersHeading).toBeVisible();
  await admin.searchUser(credentials.username);
  await expect(admin.records.first()).toBeVisible();
  await expect(admin.records.first()).toContainText(credentials.username);
});

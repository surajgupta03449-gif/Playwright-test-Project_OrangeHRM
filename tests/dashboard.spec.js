const { test, expect } = require('../fixtures/testFixtures');

test('TC04 - Dashboard: open and verify dashboard widgets', async ({ authenticated }) => {
  await expect(authenticated).toHaveURL(/dashboard/);
  await expect(authenticated.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(authenticated.locator('.oxd-grid-3').first()).toBeVisible();
});

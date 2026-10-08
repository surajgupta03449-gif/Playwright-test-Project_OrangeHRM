const { test, expect } = require('../fixtures/testFixtures');
const { ModulePage } = require('../pages/ModulePage');

test('TC07 - Leave: open module and verify Leave List', async ({ authenticated }) => {
  const modules = new ModulePage(authenticated);
  await modules.open('Leave');
  await expect(authenticated.getByRole('heading', { name: 'Leave List' })).toBeVisible();
  await expect(authenticated.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
});

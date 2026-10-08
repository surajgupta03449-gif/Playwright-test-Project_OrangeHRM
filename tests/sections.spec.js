const { test, expect } = require('../fixtures/testFixtures');
const { ModulePage } = require('../pages/ModulePage');

const sections = [
  ['Time', 'Time'],
  ['Recruitment', 'Recruitment'],
  ['Performance', 'Performance'],
  ['Directory', 'Directory'],
  ['Maintenance', 'Maintenance'],
  ['Claim', 'Claim'],
  ['Buzz', 'Buzz']
];

for (const [name, expected] of sections) {
  test(`TC - ${name}: click, open, and verify section`, async ({ authenticated }) => {
    const modules = new ModulePage(authenticated);
    await modules.open(name);
    await expect(modules.breadcrumb).toContainText(expected);
  });
}

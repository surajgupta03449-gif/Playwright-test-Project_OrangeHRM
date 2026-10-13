const { test, expect } = require("../fixtures/testFixtures");
const { PIMPage } = require("../pages/PIMPage");
const { uniqueEmployee } = require("../test-data/employeeData");

test("TC06 - PIM: open, add employee, search employee, and delete employee", async ({ authenticated }) => {
  const page = authenticated.page || authenticated;
  const pim = new PIMPage(page);
  const employee = uniqueEmployee();

  const fullName = [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(" ");

  // Add employee and verify profile navigation.
  await pim.addEmployee(employee.firstName, employee.middleName || "", employee.lastName);

  await expect(pim.personalDetails).toBeVisible();

  // Search for this specific employee.
  await pim.searchEmployee(fullName);

  // Confirm the newly created employee appears in the results.
  const employeeRow = pim.tableRows
    .filter({
      hasText: employee.lastName,
    })
    .first();

  await expect(employeeRow).toBeVisible({
    timeout: 15000,
  });

  // Delete and verify removal.
  await pim.deleteEmployeeByName(employee.lastName);
});

test("TC07 - PIM: reset employee search", async ({ authenticated }) => {
  const page = authenticated.page || authenticated;
  const pim = new PIMPage(page);

  await pim.open();

  await expect(pim.employeeNameInput).toBeVisible({
    timeout: 15000,
  });

  await pim.employeeNameInput.fill("Test");
  await pim.resetButton.click();

  await expect(pim.employeeNameInput).toHaveValue("");
});

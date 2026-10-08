const { test, expect } = require("../fixtures/testFixtures");
const { PIMPage } = require("../pages/PIMPage");
const { uniqueEmployee } = require("../test-data/employeeData");

test("TC06 - PIM: open, add employee, search employee, and delete employee", async ({ authenticated }) => {
  const pim = new PIMPage(authenticated);
  const employee = uniqueEmployee();

  await pim.addEmployee(employee.firstName, employee.middleName, employee.lastName);

  await expect(pim.personalDetails).toBeVisible();

  await pim.searchEmployee(employee.firstName);

  await expect(pim.tableRows.filter({ hasText: employee.lastName }).first()).toBeVisible();

  await pim.deleteEmployeeByName(employee.lastName);

  await expect(pim.successToast).toBeVisible();
});

test("TC07 - PIM: reset employee search", async ({ authenticated }) => {
  const pim = new PIMPage(authenticated);

  await pim.open();

  await pim.employeeNameInput.waitFor({
    state: "visible",
    timeout: 30000,
  });

  await pim.employeeNameInput.fill("Test");

  await pim.resetButton.click();

  await expect(pim.employeeNameInput).toHaveValue("");
});

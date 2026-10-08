function uniqueEmployeeData() {
  const id = Date.now().toString().slice(-6);
  return { firstName: "Suraj", middleName: "QA", lastName: `Playwright${id}`, fullName: `Suraj QA Playwright${id}` };
}
module.exports = { uniqueEmployeeData };

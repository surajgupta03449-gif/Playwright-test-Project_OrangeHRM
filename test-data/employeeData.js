function uniqueEmployee() {
  const id = Date.now().toString().slice(-6);
  return { firstName: 'Suraj', middleName: 'QA', lastName: `Test${id}`, searchName: `Suraj Test${id}` };
}
module.exports = { uniqueEmployee };

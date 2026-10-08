module.exports = {
  validUser: {
    username: process.env.ORANGEHRM_USERNAME || 'Admin',
    password: process.env.ORANGEHRM_PASSWORD || 'admin123'
  },
  invalidUser: { username: 'InvalidUser123', password: 'wrongpassword' },
  emptyUser: { username: '', password: '' }
};

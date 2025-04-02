// models/index.js
const sequelize = require('./db');
const User = require('./user');
const UserPaymentGroupsWallet = require('./userPaymentGroupWallet');
// Import other models as needed

// Set up associations
UserPaymentGroupsWallet.belongsTo(User, { foreignKey: 'userId' });
// Add other associations as needed

module.exports = {
  sequelize,
  User,
  UserPaymentGroupsWallet
  // Export other models
};
const sequelize = require("./db");
const User = require("./user");
const PaymentGroup = require("./PaymentGroup");
const UserPaymentGroupsWallet = require("./userPaymentGroupWallet");
const Event = require("./events");

// Exemple d’association possible
UserPaymentGroupsWallet.belongsTo(PaymentGroup, {
  foreignKey: "paymentGroupId",
});
Event.belongsTo(User, { foreignKey: "organizerId" }); // Si tu veux lier l'event à un user

module.exports = {
  sequelize,
  User,
  PaymentGroup,
  Event,
  UserPaymentGroupsWallet,
};

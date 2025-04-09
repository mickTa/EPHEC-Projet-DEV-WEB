const sequelize = require("./db");
const User = require("./user");
const PaymentGroup = require("./PaymentGroup");
const UserPaymentGroupsWallet = require("./userPaymentGroupWallet");
const Event = require("./events");

// Exemple d’association possible
UserPaymentGroupsWallet.belongsTo(PaymentGroup, {
  foreignKey: "paymentGroupId",
});
// Event.belongsTo(User, { foreignKey: "organizerId" }); // Pour lier l'event à un user (à faire plus tard)

module.exports = {
  sequelize,
  User,
  PaymentGroup,
  Event,
  UserPaymentGroupsWallet,
};

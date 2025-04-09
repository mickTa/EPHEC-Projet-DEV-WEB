const PaymentGroup = require("./paymentGroups");
const Event = require("./event");

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

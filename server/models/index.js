const sequelize = require("./db");
const User = require("./user");
const Wallet = require("./wallet");
const Event = require("./events");
const { RoleRequest } = require("./roleRequest");

Wallet.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Wallet, { foreignKey: "userId" });
User.hasMany(RoleRequest, { foreignKey: "userId" });
User.hasMany(RoleRequest, { foreignKey: "adminUserId" });

Event.belongsTo(User, { 
  foreignKey: "organizerId", 
  as: "organizer" // Alias for better readability
});
User.hasMany(Event, { foreignKey: "organizerId" });

module.exports = {
  sequelize,
  User,
  Wallet,
  Event,
};
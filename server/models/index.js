const sequelize = require("./db");
const User = require("./user");
const Wallet = require("./wallet");
const Event = require("./events");

Wallet.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Wallet, { foreignKey: "userId" });

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
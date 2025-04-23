const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db");

const PaymentRequest = sequelize.define("PaymentRequest", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  walletId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  description: { type: DataTypes.STRING(255), allowNull: false },
  status: { type: DataTypes.STRING(50), defaultValue: "PENDING" }, // PENDING, ACCEPTED, REFUSED
});

module.exports = { PaymentRequest };

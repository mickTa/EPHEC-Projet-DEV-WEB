const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db");

const RoleRequest = sequelize.define("RoleRequest", {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING(255), allowNull: false },
  date: { type: DataTypes.BIGINT, allowNull: false }, // date timestamp (ms)
  adminUserId: { type: DataTypes.INTEGER, allowNull: true }, // id of admin that accepted the request
  status: { type: DataTypes.STRING(50), defaultValue: "PENDING" }, // PENDING, ACCEPTED, REFUSED
});

module.exports = { RoleRequest };

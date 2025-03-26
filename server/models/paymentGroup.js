const { Model, DataTypes } = require("sequelize");
const connection = require("./db");

class PaymentGroup extends Model {}

PaymentGroup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    walletLink: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    tableName: "paymentGroups",
    sequelize: connection,
    timestamps: false
  }
);

module.exports = PaymentGroup;
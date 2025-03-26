const { Model, DataTypes } = require("sequelize");
const connection = require("./db");

class UserPaymentGroupsWallet extends Model {}

UserPaymentGroupsWallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      }
    },
    paymentGroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "paymentGroups",
        key: "id"
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    tableName: "userPaymentGroupsWallets",
    sequelize: connection,
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    indexes: [
      {
        unique: true,
        fields: ['userId', 'paymentGroupId']
      }
    ]
  }
);

module.exports = UserPaymentGroupsWallet;
const { Model, DataTypes } = require("sequelize");
const connection = require("./db");

class Wallet extends Model {}

Wallet.init(
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
      },
      onDelete: "CASCADE"
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "events",
        key: "id"
      },
      onDelete: "SET NULL"
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "wallets",
    sequelize: connection,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'organizerId', 'eventId']  
      }
    ]
  }
);

module.exports = Wallet;

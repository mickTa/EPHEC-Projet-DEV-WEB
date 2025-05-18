const { DataTypes } = require("sequelize");
const db = require("./db"); // ta connexion Sequelize

const PaymentRequest = db.define(
  "payment_request", // nom du modèle (singulier)
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    wallet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "payment_requests", // nom exact de la table en base
    timestamps: true, // ajoute createdAt, updatedAt
    underscored: true, // pour snake_case des colonnes timestamps
  }
);

module.exports = PaymentRequest;

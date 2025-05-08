const { Model, DataTypes } = require('sequelize');
const connection = require('./db');
const Event = require('./events');

class Registration extends Model {}

Registration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'event_registrations', 
    sequelize: connection,
    timestamps: true, 
  }
);

Registration.belongsTo(Event, {
  foreignKey: 'eventId',
  as: 'event',
});

module.exports = Registration;

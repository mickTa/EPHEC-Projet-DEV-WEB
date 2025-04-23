const { Model, DataTypes } = require("sequelize");
const connection = require("./db");

class Event extends Model {}

Event.init(
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
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.STRING(511),
    },
    videoUrl: {
      type: DataTypes.STRING(511),  // 👈 ici
      allowNull: true
    }
  },
  {
    tableName: "events",
    sequelize: connection,
    timestamps: false,
  }
);


module.exports = Event;
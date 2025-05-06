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
      field: "organizerId",
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
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(511),
      allowNull: true
    },
    videoUrl: {
      type: DataTypes.STRING(511),
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(511),
      allowNull: true
    }
  },
  {
    tableName: "events",
    sequelize: connection,
    timestamps: false
  }
);


module.exports = Event;
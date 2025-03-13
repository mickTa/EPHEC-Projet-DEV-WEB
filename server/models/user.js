const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const connection = require("./db");

class User extends Model {}

User.init(
  {
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("USER", "ADMIN"),
      defaultValue: "USER",
    },
  },
  {
    tableName: "users",
    sequelize: connection,
  }
);

User.addHook("beforeCreate", async (user) => {
  user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
});

User.addHook("beforeUpdate", async (user, { fields }) => {
  if (fields.includes("password")) {
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
  }
});

module.exports = User;

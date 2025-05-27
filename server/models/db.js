require("dotenv").config();
const { Sequelize } = require("sequelize");

let connection;

if (process.env.NODE_ENV === "test") {
  connection = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
} else {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL is not defined!");
    process.exit(1);
  }

  connection = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  });

  connection
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => {
      console.error("Database connection error:", err);
      process.exit(1);
    });
}

module.exports = connection;

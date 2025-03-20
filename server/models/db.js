require("dotenv").config();

const { Sequelize } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not defined!");
  process.exit(1);
}

const connection = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
});

connection
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

module.exports = connection;

const { Sequelize } = require("sequelize");

const defaultDatabaseUrl = "mysql://root:PASSWORDHERE@localhost:3306/bdd";

const connection = new Sequelize(
    process.env.DATABASE_URL ?? defaultDatabaseUrl
);

connection.authenticate().then(() => console.log("Database is ready"));

module.exports = connection;

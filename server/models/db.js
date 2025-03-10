const { Sequelize } = require("sequelize");

const databaseUrl = "";

const connection = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: false,
});

connection.authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

module.exports = connection;

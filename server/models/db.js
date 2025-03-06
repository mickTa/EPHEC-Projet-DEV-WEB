const { Sequelize } = require("sequelize");

const databaseUrl = "postgres://your_username_here:your_password_here@54.36.182.213:5432/qufest_db";

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

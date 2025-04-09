// docs/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de gestion d’événements et paiements",
      version: "1.0.0",
      description: "Documentation de l'API backend avec Express + Sequelize",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Cible les fichiers où on mettra les commentaires Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

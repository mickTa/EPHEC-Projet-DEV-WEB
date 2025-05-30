const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const logConnection = require("./middlewares/logConnection");

const app = express();
app.use(cors());

// Middlewares
app.use(express.json());
app.use(logConnection);

// Routes
const securityRoutes = require("./routes/security");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const walletRoutes = require("./routes/wallets");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const roleRequestsRoutes = require("./routes/roleRequests");
const registrationRoutes = require("./routes/registration");
const adminRoutes = require("./routes/admin");
const paymentRequestRoutes = require("./routes/paymentRequests");

// Définition des routes
app.use("/api/auth", securityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api", qrCodeRoutes);
app.use("/api/roleRequests", roleRequestsRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment-requests", paymentRequestRoutes);

if (process.env.NODE_ENV !== "test") {
  const swaggerUi = require("swagger-ui-express");
  const YAML = require("yamljs");
  const swaggerDocument = YAML.load("./docs/swagger.yaml");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.get("/", (_, res) =>
  res.send("API RESTful de l'application de gestion d'événements")
);

module.exports = app;

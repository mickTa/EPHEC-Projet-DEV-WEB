const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const dotenv = require("dotenv");
const securityRoutes = require("./routes/security");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const walletRoutes = require("./routes/wallets");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const registrationRoutes = require("./routes/registration");
const payment_requests = require("./routes/paymentRequests");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { init } = require("./utils/socket");

dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(express.json());

init(server);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Répertoire "uploads" créé.');
}

// Définition des routes
app.use(cors());
app.use("/api/auth", securityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api", qrCodeRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/payment-requests", payment_requests);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_, res) =>
  res.send("API RESTful de l'application de gestion d'événements")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

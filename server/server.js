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
const paymentRequestRoutes = require("./routes/paymentRequest");
const roleRequestsRoutes = require("./routes/roleRequests");
const registrationRoutes = require("./routes/registration");
const cors = require("cors");
const fs = require('fs');
const path = require('path');

dotenv.config();
const app = express();
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Répertoire "uploads" créé.');
}

// Définition des routes
app.use(cors());
app.use("/api/auth", securityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api", qrCodeRoutes);
app.use("/api/payment-request", paymentRequestRoutes);
app.use("/api/roleRequests", roleRequestsRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

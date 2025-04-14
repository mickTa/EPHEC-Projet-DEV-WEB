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
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());

// Définition des routes
app.use(cors());
app.use("/auth", securityRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/wallet", walletRoutes);
app.use("/api", qrCodeRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

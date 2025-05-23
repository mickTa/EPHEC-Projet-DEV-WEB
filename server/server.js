const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Routes
const securityRoutes = require("./routes/security");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const walletRoutes = require("./routes/wallets");
const qrCodeRoutes = require("./routes/qrCodeRoutes");
const paymentRequestRoutes = require("./routes/paymentRequest");
const registrationRoutes = require("./routes/registration");
const adminRoutes = require("./routes/admin");  // <-- ajout route admin

// Middlewares
const logConnection = require("./middlewares/logConnection");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use(logConnection);


// Définition des routes
app.use("/api/auth", securityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api", qrCodeRoutes);
app.use("/api/payment-request", paymentRequestRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

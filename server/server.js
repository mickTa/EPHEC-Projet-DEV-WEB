const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./docs/swagger.yaml");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = require("./utils/socket").init(server);

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

// Middlewares
const logConnection = require("./middlewares/logConnection");
app.use(express.json());
app.use(logConnection);

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_, res) =>
  res.send("API RESTful de l'application de gestion d'événements")
);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});

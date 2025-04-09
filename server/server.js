const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const dotenv = require("dotenv");
const securityRoutes = require("./routes/security");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const paymentGroupRoutes = require("./routes/paymentGroups");
const walletRoutes = require("./routes/userPaymentGroupWallets");
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
app.use("/payment-group", paymentGroupRoutes);
app.use("/wallet", walletRoutes);
app.use("/api", qrCodeRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

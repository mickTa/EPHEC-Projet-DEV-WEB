const express = require("express");
const dotenv = require("dotenv");
const securityRoutes = require("./routes/security");
const userRoutes = require("./routes/users");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());

// Définition des routes
app.use(cors());
app.use("/auth", securityRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

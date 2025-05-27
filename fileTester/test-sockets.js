const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  transports: ["polling"], // Force le fallback HTTP
  reconnectionAttempts: 3,
  timeout: 5000,
  forceNew: true,
  allowEIO3: true, // Rend compatible avec les anciennes versions
});

socket.on("connect", () => {
  console.log("Connecté au serveur Socket.IO avec ID :", socket.id);
  socket.emit("register", "6");
});

socket.on("newPaymentRequest", (data) => {
  console.log("Demande reçue via socket :", data);
});

socket.on("connect_error", (err) => {
  console.error("Erreur de connexion Socket.IO :", err.message);
});

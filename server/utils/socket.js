const { Server } = require("socket.io");

let io;
const userSockets = new Map();

function init(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Utilisateur connecté", socket.id);

    socket.on("register", (userId) => {
      const cleanId = String(userId).replace(/"/g, "");
      console.log(`Reçu register(${cleanId}) de socket ${socket.id}`);
      userSockets.set(cleanId, socket.id);
      console.log(`Utilisateur ${cleanId} enregistré avec socket ${socket.id}`);
      console.log("userSockets:", [...userSockets.entries()]);
    });

    socket.on("pingTest", (msg) => {
      console.log("Ping reçu du client :", msg);
      socket.emit("pongTest", "Réponse du serveur : Pong !");
    });

    socket.on("disconnect", () => {
      console.log("Utilisateur déconnecté", socket.id);
      for (const [userId, sockId] of userSockets.entries()) {
        if (sockId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { init, getIO, userSockets };

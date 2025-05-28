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

      // Supprimer toutes les anciennes associations de ce user
      for (const [uid, sid] of userSockets.entries()) {
        if (uid === cleanId) {
          userSockets.delete(uid);
        }
      }

      // Associer le userId au nouveau socket actif
      userSockets.set(cleanId, socket.id);

      console.log(`✅ REGISTER user ${cleanId} → socket ${socket.id}`);
      console.log("📦 userSockets:", [...userSockets.entries()]);
    });

    socket.on("pingTest", (msg) => {
      console.log("Ping reçu du client :", msg);
      socket.emit("pongTest", "Réponse du serveur : Pong !");
    });

    socket.on("disconnect", () => {
      console.log("🔌 Déconnexion socket", socket.id);

      for (const [userId, sockId] of userSockets.entries()) {
        if (sockId === socket.id) {
          userSockets.delete(userId);
          console.log(`❌ Socket supprimé pour user ${userId}`);
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

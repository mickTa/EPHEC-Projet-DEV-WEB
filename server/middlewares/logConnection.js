const db = require("../firebase");

const logConnection = async (req, res, next) => {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };

    await db.collection("api-logs").add(logEntry);
    console.log("Connexion loggée dans Firestore");
  } catch (error) {
    console.error("Erreur lors du log Firebase :", error);
  }

  next();
};

module.exports = logConnection;

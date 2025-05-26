const db = require("../firebase");

exports.getLogs = async (req, res) => {
  try {
    const snapshot = await db
      .collection("api-logs")
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Erreur lors de la récupération des logs :", error);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
};

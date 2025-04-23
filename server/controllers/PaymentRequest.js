const db = require("../models/db");

exports.createPaymentRequest = async (req, res) => {
  try {
    const { userId, organizerId, eventId, amount, description } = req.body;

    if (!userId || !organizerId || !amount) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    const result = await db.query(
      `INSERT INTO "payment_requests" ("userId", "organizerId", "eventId", "amount", "description", "status", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, 'PENDING', NOW(), NOW())
       RETURNING *`,
      [userId, organizerId, eventId || null, amount, description || ""]
    );

    res
      .status(201)
      .json({ message: "Demande de paiement créée", request: result.rows[0] });
  } catch (error) {
    console.error("Erreur création demande paiement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

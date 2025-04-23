const { PaymentRequest } = require("../models/PaymentRequest");

exports.createPaymentRequest = async (req, res) => {
  const { userId, walletId, amount, description } = req.body;

  try {
    const newRequest = await PaymentRequest.create({
      userId,
      walletId,
      amount,
      description,
      status: "PENDING", // En attente de validation
    });

    return res.json({ success: true, request: newRequest });
  } catch (error) {
    console.error("Erreur création demande paiement:", error);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

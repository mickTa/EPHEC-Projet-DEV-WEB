const PaymentGroup = require("../models/PaymentGroup");

exports.NewPaymentGroup = async (req, res) => {
  try {
    const paymentGroup = await PaymentGroup.create(req.body);
    res.status(201).json(paymentGroup);
  } catch (err) {
    console.error("Erreur Sequelize :", err);
    res.status(500).json({ error: err.message });
  }
};

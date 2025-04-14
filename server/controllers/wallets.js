const Wallet = require("../models/wallet");

exports.NewWallet = async (req, res) => {
  try {
    const wallet = await Wallet.create(req.body);
    res.status(201).json(wallet);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: err.message,
      details: err.errors?.map((e) => e.message),
    });
  }
};
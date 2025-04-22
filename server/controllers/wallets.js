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

exports.AddMoney = async (req, res) => {
  try {
    const { walletId, amount } = req.body;
    const wallet = await Wallet.findByPk(walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    wallet.amount = parseFloat(wallet.amount) + parseFloat(amount);
    await wallet.save();
    res.status(200).json(wallet);
  }
  catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: err.message,
      details: err.errors?.map((e) => e.message),
    });
  }
}


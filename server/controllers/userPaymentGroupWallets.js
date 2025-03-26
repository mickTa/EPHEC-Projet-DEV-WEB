const Wallet = require('../models/userPaymentGroupWallet');

exports.NewWallet = async (req, res) => {
    try {
        const userPaymentGroupsWallet = await Wallet.create(req.body);
        res.status(201).json(Wallet);
    } catch (err) {
        console.error("Sequelize Error:", err);
        res.status(500).json({ 
            error: err.message,
            details: err.errors?.map(e => e.message) // Include validation error details
        });
    }
  };
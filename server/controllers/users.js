const { UserPaymentGroupsWallet, User } = require('../models');

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}


exports.post = async (req, res) => {
  try {
      const { password } = req.body;

      if (!validatePassword(password)) {
          return res.status(400).json({
              error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
          });
      }
      const user = await User.create(req.body);
      res.status(201).json(user);
  } catch (err) {
      console.error("Erreur Sequelize :", err);
      res.status(500).json({ error: err.message });
  }
};


exports.getMe = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(req.user);
};

exports.getUserWallets = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wallets = await UserPaymentGroupsWallet.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']] // Newest first
    });

    res.json(wallets);
  } catch (error) {
    console.error("Error fetching user wallets:", error);
    res.status(500).json({ 
      error: "Failed to retrieve wallets",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


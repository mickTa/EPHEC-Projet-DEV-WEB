const User = require("../models/user");
const Wallet = require("../models/wallet");
const bcrypt = require("bcryptjs");

function validatePassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // Vérifie que l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Ancien mot de passe incorrect" });
    }

    // Vérifie si le nouveau mot de passe respecte les critères
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(
      newPassword,
      await bcrypt.genSalt()
    );

    // Mise à jour du mot de passe
    await req.user.update({ password: hashedPassword });

    console.log("Nouveau mot de passe hashé :", hashedPassword);

    res.json({ message: "Mot de passe changé avec succès !" });
  } catch (err) {
    console.error("Erreur lors du changement de mot de passe :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.post = async (req, res) => {
  try {
    const { password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
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

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to retrieve user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

exports.getUserWallets = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wallets = await Wallet.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]], // Newest first
      limit,
      offset,
    });

    res.json(wallets);
  } catch (error) {
    console.error("Error fetching user wallets:", error);
    res.status(500).json({
      error: "Failed to retrieve wallets",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

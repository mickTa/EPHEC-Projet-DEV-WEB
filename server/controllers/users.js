const User = require("../models/user");
const bcrypt = require("bcryptjs");

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
                error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
            });
        }

        // Hash du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt());

        // Mise à jour du mot de passe
        req.user.password = hashedPassword;
        await req.user.save();

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

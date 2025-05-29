const RoleRequest = require("../models/roleRequest");
const User = require("../models/user");
const Wallet = require("../models/wallets");
const bcrypt = require("bcryptjs");
const cloudinary = require("../cloudinary");
const streamifier = require("streamifier");

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

    res.json({ message: "Mot de passe changé avec succès !" });
  } catch (err) {
    console.error("Erreur lors du changement de mot de passe :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.requestRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    // Création requête de rôle
    await RoleRequest.create({
      userId: req.user.id,
      role: role,
      date: Date.now(), 
      status: "PENDING"
    });
    res.status(200);

    // console.log("Requête créée :", role);

    res.json({ message: "Requête envoyée aux administrateurs" });
  } catch (err) {
    console.error("Erreur lors de la requête de rôle :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

exports.post = async (req, res) => {
  try {
    const { password, role, ...rest } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
      });
    }
    if (role && role.toUpperCase() === "ADMIN") {
      return res.status(403).json({
        error: "La création de comptes ADMIN est interdite via cette route.",
      });
    }

    const user = await User.create({ ...rest, password, role: role || "USER" });
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
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email", "role"],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
    res.status(200);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to retrieve user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getUserWallets = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const wallets = await Wallet.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
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

exports.setPfp = async (req, res) => {
  try {
    let user = await User.findByPk(req.user.id);
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "users" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    user.update({ pfpUrl: result.secure_url });
    res
      .status(200)
      .json({
        message: "Image téléchargée avec succès",
        url: result.secure_url,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
  }
};

module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  }
  next();
};

const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (authorized) => {
  return async (req, res, next) => {
    const header = req.headers.authorization ?? req.headers.Authorization;
    if (!header) {
      return res.sendStatus(401).json({ error: "Header manquant" });
    }

    const [type, token] = header.split(/\s+/);
    if (type !== "Bearer") {
      return res.sendStatus(401).json({ error: "Bearer manquant" });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(payload.id);
      if (!req.user) return res.sendStatus(401);
      if (!authorized || !authorized.includes(req.user.role)) return res.status(403).json({ error: `Accès réservé aux roles ${authorized.join(" ")}` });

      next();
    } catch (e) {
      console.log(e.message);
      return res.sendStatus(401);
    }
  };
};
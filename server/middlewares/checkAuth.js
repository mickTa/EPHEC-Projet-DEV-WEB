const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports=({authorized,forbidden}={undefined,undefined})=>{
  return async (req, res, next) => {
    const header = req.headers.authorization ?? req.headers.Authorization;
    if (!header) {
      return res.sendStatus(401);
    }

    const [type, token] = header.split(/\s+/);
    if (type !== "Bearer") {
      return res.sendStatus(401);
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(payload.id);
      if (!req.user) return res.sendStatus(401);
      if (forbidden&&forbidden.includes(req.user.role)) return res.sendStatus(401);
      if (authorized&&!authorized.includes(req.user.role)) return res.sendStatus(401);

      next();
    } catch (e) {
      return res.sendStatus(401);
    }
  };
};
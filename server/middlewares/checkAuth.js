const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    const header = req.headers.authorization ?? req.headers.Authorization;
    if (!header) {
        return res.sendStatus(401);
    }

    const [type, token] = header.split(/\s+/);
    if (type !== "Bearer") {
        return res.sendStatus(401);
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET ?? "732acd4f2953a2ca8dbd2cc1f79dbeb46829d5d59fdf76ecf933485828100d5ea5c00ea4f1191b334ceb80e841774edb0cf7d6ab743b3610376dbf22b1e09dfe"
        );

        req.user = await User.findByPk(payload.id);
        if (!req.user) return res.sendStatus(401);

        next();
    } catch (e) {
        return res.sendStatus(401);
    }
};

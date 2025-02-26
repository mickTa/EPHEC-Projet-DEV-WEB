const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.sendStatus(401);
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET ?? "732acd4f2953a2ca8dbd2cc1f79dbeb46829d5d59fdf76ecf933485828100d5ea5c00ea4f1191b334ceb80e841774edb0cf7d6ab743b3610376dbf22b1e09dfe"
        );

        res.json({ token });
    },
};

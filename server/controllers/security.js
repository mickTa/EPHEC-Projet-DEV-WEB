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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token });
  },
};

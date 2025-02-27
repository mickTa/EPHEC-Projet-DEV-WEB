const User = require("../models/user");

exports.post = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};


exports.getMe = async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.json(req.user);
};

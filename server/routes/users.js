const { Router } = require("express");
const UserController = require("../controllers/users");

const router = new Router();

// Route pour l'inscription
router.post("/", UserController.post);

module.exports = router;

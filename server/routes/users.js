const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/checkAuth"); 

const router = new Router();

router.get("/me", checkAuth(), UserController.getMe);

// Route pour l'inscription
router.post("/", UserController.post);

module.exports = router;

const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");

const router = new Router();

router.get(
  "/me",
  checkAuth(),
  UserController.getMe
);

router.get(
  "/getByIndex/:id",
  UserController.getUserById
);

router.get(
  "/me/wallets",
  checkAuth({ forbidden: ["ORGANIZER"] }),
  UserController.getUserWallets
);

router.post("/changePassword", checkAuth(), UserController.changePassword);

router.post("/setPfp",checkAuth(),upload.single("image"),UserController.setPfp);

// Route pour l'inscription
router.post("/", UserController.post);

module.exports = router;

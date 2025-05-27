const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const constants = require("../middlewares/constants.js");


const router = new Router();

router.get(
  "/me",
  checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]),
  UserController.getMe
);

router.get(
  "/getByIndex/:id",
  checkAuth([constants.ROLE_TYPE_ADMIN]),
  UserController.getUserById
);

router.get(
  "/me/wallets",
  checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_USER]),
  UserController.getUserWallets
);

router.post("/changePassword", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), UserController.changePassword);

router.post("/requestRole", checkAuth([constants.ROLE_TYPE_USER]), UserController.requestRole);

router.post("/setPfp", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), upload.single("image"), UserController.setPfp);

// Route pour l'inscription
router.post("/", UserController.post);

module.exports = router;

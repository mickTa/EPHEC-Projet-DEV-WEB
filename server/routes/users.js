const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/checkAuth");

const router = new Router();

router.get(
  "/me",
  checkAuth({ forbidden: ["ORGANIZER"] }),
  UserController.getMe
);
router.get(
  "/me/wallets",
  checkAuth({ forbidden: ["ORGANIZER"] }),
  UserController.getUserWallets
);
router.post("/changePassword", checkAuth(), UserController.changePassword);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */

// Route pour l'inscription
router.post("/", UserController.post);

module.exports = router;

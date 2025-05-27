const { Router } = require('express');
const walletController = require('../controllers/wallets');
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");

const router = new Router();

router.post('/', checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_USER]), walletController.NewWallet);
router.post('/addMoney', checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_USER]), walletController.AddMoney);

module.exports = router;
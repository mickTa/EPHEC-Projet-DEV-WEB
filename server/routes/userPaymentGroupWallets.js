const { Router } = require('express');
const walletController = require('../controllers/userPaymentGroupWallets');
const checkAuth = require('../middlewares/checkAuth');

const router = new Router();

router.post('/', checkAuth, walletController.NewWallet);

module.exports = router;
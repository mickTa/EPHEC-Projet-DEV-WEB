const { Router } = require('express');
const walletController = require('../controllers/userPaymentGroupWallets');


const router = new Router();

router.post('/', walletController.NewWallet);

module.exports = router;
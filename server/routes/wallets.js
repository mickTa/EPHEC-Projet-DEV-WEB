const { Router } = require('express');
const walletController = require('../controllers/wallets');


const router = new Router();

router.post('/', walletController.NewWallet);

module.exports = router;
const { Router } = require('express');
const walletController = require('../controllers/wallets');


const router = new Router();

router.post('/', walletController.NewWallet);
router.post('/addMoney', walletController.AddMoney);

module.exports = router;
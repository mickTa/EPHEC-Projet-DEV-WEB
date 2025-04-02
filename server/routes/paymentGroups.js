const { Router } = require('express');
const paymentGroupController = require('../controllers/paymentGroups');
const checkAuth = require('../middlewares/checkAuth');

const router = new Router();

router.post('/', paymentGroupController.NewPaymentGroup);

module.exports = router;
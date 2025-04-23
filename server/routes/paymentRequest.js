const { Router } = require("express");
const PaymentRequestController = require("../controllers/PaymentRequest");
const checkAuth = require("../middlewares/checkAuth");

const router = new Router();

router.post("/", checkAuth(), PaymentRequestController.createPaymentRequest);

module.exports = router;

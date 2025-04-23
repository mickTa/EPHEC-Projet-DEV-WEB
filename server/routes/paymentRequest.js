const express = require("express");
const { createPaymentRequest } = require("../controllers/PaymentRequest");
const checkAuth = require("../middlewares/checkAuth");

const router = express.Router();

router.post("/request", checkAuth(), createPaymentRequest);

module.exports = router;

const express = require("express");
const { createPaymentRequest } = require("../controllers/PaymentRequest");
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");


const router = express.Router();

router.post("/request", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), createPaymentRequest);

module.exports = router;

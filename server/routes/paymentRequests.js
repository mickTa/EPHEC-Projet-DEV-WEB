const express = require("express");
const router = express.Router();
const paymentRequestController = require("../controllers/paymentRequestController");
const authenticate = require("../middlewares/checkAuth");

router.post("/", authenticate, paymentRequestController.create);
router.get("/pending", authenticate, paymentRequestController.getPending);
router.post("/:id/accept", authenticate, paymentRequestController.accept);
router.post("/:id/reject", authenticate, paymentRequestController.reject);

module.exports = router;

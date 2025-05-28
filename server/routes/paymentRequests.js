const express = require("express");
const router = express.Router();
const paymentRequestController = require("../controllers/paymentRequestController");
const checkAuth = require("../middlewares/checkAuth");

router.post("/", checkAuth(), paymentRequestController.create);
router.get("/pending", checkAuth(), paymentRequestController.getPending);
router.post("/:id/accept", checkAuth(), paymentRequestController.accept);
router.post("/:id/reject", checkAuth(), paymentRequestController.reject);

module.exports = router;

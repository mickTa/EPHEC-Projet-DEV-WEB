const express = require("express");
const router = express.Router();
const paymentRequestController = require("../controllers/paymentRequestController");
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");

router.post("/", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), paymentRequestController.create);
router.get("/pending", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), paymentRequestController.getPending);
router.post("/:id/accept", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), paymentRequestController.accept);
router.post("/:id/reject", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), paymentRequestController.reject);

module.exports = router;

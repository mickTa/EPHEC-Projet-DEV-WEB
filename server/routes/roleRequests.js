const { Router } = require("express");
const RoleRequestController = require("../controllers/roleRequests");
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");

const router = new Router();

router.get("/getAll", checkAuth([constants.ROLE_TYPE_ADMIN]), RoleRequestController.getAll);
router.post("/acceptRequest", checkAuth([constants.ROLE_TYPE_ADMIN]), RoleRequestController.acceptRequest);
router.post("/rejectRequest", checkAuth([constants.ROLE_TYPE_ADMIN]), RoleRequestController.rejectRequest);

module.exports = router;

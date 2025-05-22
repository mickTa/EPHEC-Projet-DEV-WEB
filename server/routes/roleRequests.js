const { Router } = require("express");
const RoleRequestController = require("../controllers/roleRequests");
const checkAuth = require("../middlewares/checkAuth");

const router = new Router();

router.get("/getAll", checkAuth(), RoleRequestController.getAll);
router.post("/acceptRequest", checkAuth(), RoleRequestController.acceptRequest);
router.post("/rejectRequest", checkAuth(), RoleRequestController.rejectRequest);


module.exports = router;

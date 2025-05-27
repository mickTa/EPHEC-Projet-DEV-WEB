const { Router } = require("express");
const router = new Router();
const adminController = require("../controllers/admin");
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");


router.get("/logs", checkAuth([constants.ROLE_TYPE_ADMIN]), adminController.getLogs);

module.exports = router;

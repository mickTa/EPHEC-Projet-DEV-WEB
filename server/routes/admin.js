const { Router } = require("express");
const router = new Router();
const adminController = require("../controllers/admin");
const checkAuth = require("../middlewares/checkAuth");
const isAdmin = require("../middlewares/isAdmin");

router.get("/logs", checkAuth(), isAdmin, adminController.getLogs);

module.exports = router;

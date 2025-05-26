const { Router } = require("express");
const router = new Router();
const adminController = require("../controllers/admin");
const checkAuth = require("../middlewares/checkAuth");

router.get("/logs", checkAuth({authorized:["ADMIN"]}), adminController.getLogs);

module.exports = router;

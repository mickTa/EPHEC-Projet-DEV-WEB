const{Router}=require("express");
const EventController=require("../controllers/events.js");
const checkAuth=require("../middlewares/checkAuth"); 

const router = new Router();

router.post("/",checkAuth,EventController.NewEvent);

module.exports = router;
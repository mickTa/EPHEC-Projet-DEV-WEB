const{Router}=require("express");
const EventController=require("../controllers/events.js");
const checkAuth=require("../middlewares/checkAuth"); 

const router = new Router();

router.post("/",checkAuth(),EventController.NewEvent);
router.get("/", EventController.getAllEvents);
router.get("/my", EventController.getMyEvents);
router.put("/",checkAuth(),EventController.UpdateEvent)

module.exports = router;
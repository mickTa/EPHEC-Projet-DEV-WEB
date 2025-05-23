const{Router}=require("express");
const EventController=require("../controllers/events.js");
const checkAuth=require("../middlewares/checkAuth"); 
const upload = require("../middlewares/upload");


const router = new Router();

router.post("/",checkAuth(),EventController.NewEvent);
router.get("/", EventController.getAllEvents);
router.get("/subscribed", checkAuth(), EventController.getMySubscribedEvents);
router.get("/organized", checkAuth(), EventController.getMyOrganizedEvents);
router.put("/",checkAuth(),EventController.UpdateEvent)
router.get("/:id", EventController.getEventById);
router.post("/upload", checkAuth(), upload.single("image"), EventController.uploadEventImage);


module.exports = router;
const{Router}=require("express");
const EventController=require("../controllers/events.js");
const checkAuth=require("../middlewares/checkAuth"); 

const router = new Router();

router.post("/",checkAuth(),EventController.NewEvent);
router.get("/", EventController.getAllEvents);
router.get("/my", checkAuth(), EventController.getMyEvents);
router.put("/",checkAuth(),EventController.UpdateEvent)
router.get("/:id", EventController.getEventById);

const RegistrationController = require('../controllers/registrations');
router.post('/:id/register', checkAuth(), RegistrationController.registerToEvent);


module.exports = router;
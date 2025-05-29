const { Router } = require("express");
const EventController = require("../controllers/events.js");
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const constants = require("../middlewares/constants.js");


const router = new Router();

router.post("/", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER]), EventController.NewEvent);
router.get("/", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), EventController.getAllEvents);
router.get("/subscribed", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), EventController.getMySubscribedEvents);
router.get("/organized", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), EventController.getMyOrganizedEvents);
router.put("/", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER]), EventController.UpdateEvent)
router.get("/:id", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER, constants.ROLE_TYPE_USER]), EventController.getEventById);
router.post("/upload", checkAuth([constants.ROLE_TYPE_ADMIN, constants.ROLE_TYPE_ORGANIZER]), upload.single("image"), EventController.uploadEventImage);


module.exports = router;
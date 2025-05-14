const{Router}=require("express");
const RegistrationController = require('../controllers/registrations');
const checkAuth=require("../middlewares/checkAuth"); 



const router = new Router();

router.post('/', checkAuth(), RegistrationController.registerToEvent);
router.get('/:eventId',checkAuth(),RegistrationController.isRegistered);
router.delete('/:eventId',checkAuth(),RegistrationController.unregisterToEvent)

module.exports = router;
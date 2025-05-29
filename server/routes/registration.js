const { Router } = require("express");
const RegistrationController = require('../controllers/registrations');
const checkAuth = require("../middlewares/checkAuth");
const constants = require("../middlewares/constants.js");

const router = new Router();

router.post('/', checkAuth([constants.ROLE_TYPE_USER]), RegistrationController.registerToEvent);
router.get('/:eventId', checkAuth([constants.ROLE_TYPE_USER]), RegistrationController.isRegistered);
router.delete('/:eventId', checkAuth([constants.ROLE_TYPE_USER]), RegistrationController.unregisterToEvent);

module.exports = router;
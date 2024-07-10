const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');
const { validateToken } = require('../middleware/middleware');


router.get("/contacts", validateToken, contactsController.view);
router.post("/",validateToken, contactsController.find);
router.get("/contacts/add",validateToken, contactsController.form);
router.post("/contacts/add",  validateToken,contactsController.create);
router.get("/contacts/edit/:id", validateToken, contactsController.edit);
router.post("/contacts/edit/:id", validateToken, contactsController.update);
router.get("/contacts/delete/:id", validateToken, contactsController.delete);

router.get("/contacts/:id", contactsController.individualView);

module.exports = router;
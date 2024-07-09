const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');
const { validateToken } = require('../middleware/middleware');


router.get("/contacts", validateToken, contactsController.view);
router.post("/",  contactsController.find);
router.get("/contacts/add", contactsController.form);
router.post("/contacts/add", contactsController.create);
router.get("/contacts/edit/:id", contactsController.edit);
router.post("/contacts/edit/:id", contactsController.update);
router.get("/contacts/delete/:id", contactsController.delete);


router.get("/contacts/:id", contactsController.individualView);

module.exports = router;
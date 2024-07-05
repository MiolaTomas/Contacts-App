const express = require('express');
const router = express.Router();
const flavourController = require('../controllers/flavourController');


router.get("/flavor", flavourController.view);
router.post("/", flavourController.find);
router.get("/flavor/add", flavourController.form);
router.post("/flavor/add", flavourController.create);
router.get("/flavor/edit/:id", flavourController.edit);
router.post("/flavor/edit/:id", flavourController.update);
router.get("/flavor/delete/:id", flavourController.delete);
module.exports = router;
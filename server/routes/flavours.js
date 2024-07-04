const express = require('express');
const router = express.Router();
const flavourController = require('../controllers/flavourController');


router.get("/flavour", flavourController.view);
router.post("/", flavourController.find);
router.get("/flavour/add", flavourController.form);
router.post("/flavour/add", flavourController.create);

module.exports = router;
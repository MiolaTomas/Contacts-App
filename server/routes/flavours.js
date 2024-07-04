const express = require('express');
const router = express.Router();
const flavourController = require('../controllers/flavourController');


router.get("/flavor", flavourController.view);
router.post("/", flavourController.find);
router.get("/flavor/add", flavourController.form);
router.post("/flavor/add", flavourController.create);

module.exports = router;
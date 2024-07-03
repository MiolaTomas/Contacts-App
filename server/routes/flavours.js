const express = require('express');
const router = express.Router();
const flavourController = require('../controllers/flavourController');


router.get("/", flavourController.view);
router.post("/", flavourController.find);
router.get("/adduser", flavourController.form);
router.post("/adduser", flavourController.create);

module.exports = router;
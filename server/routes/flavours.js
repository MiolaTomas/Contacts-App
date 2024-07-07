const express = require('express');
const router = express.Router();
const flavourController = require('../controllers/flavourController');
const { validateToken } = require('../middleware/middleware');


router.get("/flavor", validateToken, flavourController.view);
router.post("/", validateToken, flavourController.find);
router.get("/flavor/add", validateToken,flavourController.form);
router.post("/flavor/add", validateToken,flavourController.create);
router.get("/flavor/edit/:id", validateToken,flavourController.edit);
router.post("/flavor/edit/:id", validateToken,flavourController.update);
router.get("/flavor/delete/:id", validateToken,flavourController.delete);


router.get("/flavor/:id", flavourController.individualView);

module.exports = router;
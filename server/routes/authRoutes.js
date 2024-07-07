const { Router } = require('express');
const router = Router();
const authController = require('../controllers/authController');
const { validateToken } = require('../middleware/middleware');

router.get('/signup', authController.signupGet);
router.post('/signup', authController.signupPost);
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);



module.exports = router;
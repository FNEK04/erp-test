const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signin/new_token', authController.newToken);
router.get('/info', auth, authController.info);
router.get('/logout', auth, authController.logout);

module.exports = router; 
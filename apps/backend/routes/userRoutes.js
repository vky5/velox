const express = require('express');
const { validateJWT } = require('../controllers/authController');
const { updateProfile, getProfile } = require('../controllers/userController');

const router = express.Router();

// Protect all routes after this middleware
router.use(validateJWT);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router; 
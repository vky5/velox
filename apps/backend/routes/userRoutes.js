const express = require('express');
const { validateJWT } = require('../controllers/authController');
const { updateProfile, getProfile } = require('../controllers/userController');
const { validate } = require('../model/userModel');

const router = express.Router();

// // Protect all routes after this middleware
router.use(validateJWT);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// router
//   .route('/me')
//   .use(validateJWT)
//   .get(getProfile)
//   .patch(updateProfile)
  
module.exports = router; 
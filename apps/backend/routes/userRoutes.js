const express = require('express');
const { validateJWT } = require('../controllers/authController');
const { updateProfile, getProfile } = require('../controllers/userController');

const router = express.Router();

// // Protect all routes after this middleware

// router.get('/profile', getProfile);
// router.put('/profile', updateProfile);

// these have two routes

// GET /api/v1/users/me - to get the data of the users
// PATCH /api/v1/users/me - to fix the data of myself I mean to add new data

router
  .route('/me', validateJWT)
  .get(getProfile)
  .patch(updateProfile)
  
module.exports = router; 
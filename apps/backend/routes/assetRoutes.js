const express = require('express');
const { validateJWT } = require('../controllers/authController');
const { 
  createAsset, 
  updateAssetLocation, 
  getAssets,
  getAssetWithLocations 
} = require('../controllers/assetController');

const router = express.Router();

router.use(validateJWT);

router.route('/')
  .get(getAssets)
  .post(createAsset);

router.patch('/location', updateAssetLocation);
router.get('/:gpsId', getAssetWithLocations);

module.exports = router; 
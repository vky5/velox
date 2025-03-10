const express = require('express');
const { validateJWT } = require('../controllers/authController');
const assetControllers = require("../controllers/assetController")
const router = express.Router();

router.use(validateJWT);

router.route('/')
  .get(assetControllers.getAllAssets)
  .post(assetControllers.createAsset);

router.patch('/location', assetControllers.updateAssetLocation);
router.get('/:assetid', assetControllers.getAssetWithLocations);

module.exports = router; 
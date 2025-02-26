const Asset = require('../model/assetModel');
const GPS = require('../model/gpsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createAsset = catchAsync(async (req, res, next) => {
  // Check if GPS ID already exists in GPS collection
  const existingGPS = await GPS.findOne({ gpsId: req.body.gpsId });

  if (!existingGPS) {
    console.log(req.body.gpsId)
    return next(new AppError('Invalid GPS ID. No GPS device found with this ID.', 400));
  }

  const newAsset = await Asset.create({
    ...req.body,
    owner: req.user.id
  });

  // Set default location to Delhi if no location exists
  const defaultLocation = {
    latitude: 28.6139,  // Delhi's coordinates
    longitude: 77.2090
  };

  const location = existingGPS || await GPS.create({
    assetId: req.body.gpsId,
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      asset: newAsset,
      currentLocation: location
    }
  });
});

const updateAssetLocation = catchAsync(async (req, res, next) => {
  const { latitude, longitude, gpsId } = req.body;

  // First verify the asset belongs to the user
  const asset = await Asset.findOne({ gpsId, owner: req.user.id });
  if (!asset) {
    return next(new AppError('No asset found with that GPS ID', 404));
  }

  // Create new GPS entry
  const gpsData = await GPS.create({
    assetId: gpsId,
    latitude,
    longitude,
    user: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: {
      location: gpsData
    }
  });
});

const getAssetWithLocations = catchAsync(async (req, res, next) => {
  const { gpsId } = req.params;
  
  const asset = await Asset.findOne({ 
    gpsId, 
    owner: req.user.id 
  });

  if (!asset) {
    return next(new AppError('No asset found with that GPS ID', 404));
  }

  // Get latest location
  const latestLocation = await GPS.getLatestLocation(gpsId);

  res.status(200).json({
    status: 'success',
    data: {
      asset,
      currentLocation: latestLocation
    }
  });
});

const getAssets = catchAsync(async (req, res, next) => {
  const assets = await Asset.find({ owner: req.user.id });

  // Get latest locations for all assets
  const assetsWithLocations = await Promise.all(
    assets.map(async (asset) => {
      const latestLocation = await GPS.getLatestLocation(asset.gpsId);
      return {
        ...asset.toObject(),
        currentLocation: latestLocation
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: {
      assets: assetsWithLocations
    }
  });
});

module.exports = {
  createAsset,
  updateAssetLocation,
  getAssetWithLocations,
  getAssets
}; 
const Asset = require("../model/assetModel");
const GPS = require("../model/gpsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const createAsset = catchAsync(async (req, res, next) => {
  // when creating an asset, asset model has the gps id of the the already saved gps

  const existingGPS = await GPS.findOne({ gpsId: req.body.gpsId });

  if (!existingGPS) {
    return next(new AppError("Invalid GPS Id no gps found", 400));
  }

  // if gps is already associated with an asset it cant be used

  const assetFound = await Asset.findOne({
    gpsId: req.body.gpsId,
  });

  if (assetFound) {
    return next(new AppError("An asset is already associated with GPS", 400));
  }

  // creating an asset with the owner as the req.user from jwt
  const newAsset = await Asset.create({
    ...req.body,
    owner: req.user.id,
  });

  const GPSData = await GPS.create({
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    altitude: req.body.altitude,
    assetId: newAsset._id,
    owner: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      asset: newAsset,
      currentLocation: GPSData,
    },
  });
});

/*
body{
  - name
  - type
  - gpsId
  - owner
  - latitude
  - longitude
  - altitude
}

*/
const updateAssetLocation = catchAsync(async (req, res, next) => {
  const { latitude, longitude, gpsId, assetId } = req.body;

  // First verify the asset belongs to the user
  const asset = await Asset.findOne({ gpsId, owner: req.user.id });

  if (!asset) {
    return next(new AppError("No asset found with that GPS ID", 404));
  }

  // Create new GPS entry
  const gpsData = await GPS.create({
    assetId: assetId,
    latitude,
    longitude,
    altitude,
    user: req.user.id,
  });

  res.status(200).json({
    status: "success",
    data: {
      location: gpsData,
    },
  });
});

// to get list of all locations of a particular asset
const getAssetWithLocations = catchAsync(async (req, res, next) => {
  const { assetid } = req.params;

  // const asset = await Asset.findOneById({
  //   assetId: assetid,
  //   owner: req.user.id
  // });

  // this ensures that the belongs to the owner 
  const asset = await Asset.findOne({ _id: assetid, user: req.user.id });

  if (!asset) {
    return next(new AppError("No asset found with that GPS ID", 404));
  }

  // Get latest location
  // const latestLocation = await GPS.find({ assetId: assetid })
  //   .sort({timestamp: -1}) // this is to get the latest location first
  //   .select("+assetId")

  const features = new APIFeatures(
    GPS.find({ assetId: assetid }).sort({ timestamp: -1 }, req.query),
    req.query
  )
    .filtering()
    .pagination(1, 50);

  const locations = await features.query;

  res.status(200).json({
    status: "success",
    results: locations.length,
    data: {
      asset,
      locations,
    },
  });
});

// get the list of all assets
const getAllAssets = catchAsync(async (req, res, next) => {
  const feature = new APIFeatures(Asset.find({ owner: req.user._id }))
    .pagination()
    .filtering()
    .sorting();

  const allAssets = await feature;

  res.status(200).json({
    status: "success",
    results: allAssets.length,
    data: {
      records: allAssets,
    },
  });
});

module.exports = {
  createAsset,
  updateAssetLocation,
  getAssetWithLocations,
  getAllAssets,
};

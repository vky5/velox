const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema({
  assetId: {
    type: String,
    required: [true, 'Asset ID is required'],
    index: true
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: -180,
    max: 180
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Optional fields that might be useful
  speed: {
    type: Number,
    min: 0
  },
  altitude: {
    type: Number
  },
  accuracy: {
    type: Number,
    min: 0
  },
  // Reference to the user who owns/operates the asset
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'GPS data must belong to a user']
  }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for querying locations within a time range
gpsSchema.index({ assetId: 1, timestamp: -1 });

// Index for geospatial queries
gpsSchema.index({ latitude: 1, longitude: 1 });

// Method to get the latest location for an asset
gpsSchema.statics.getLatestLocation = function(assetId) {
  return this.findOne({ assetId })
    .sort({ timestamp: -1 })
    .select('latitude longitude timestamp');
};

// Method to get location history for an asset
gpsSchema.statics.getLocationHistory = function(assetId, startTime, endTime) {
  return this.find({
    assetId,
    timestamp: {
      $gte: startTime,
      $lte: endTime || Date.now()
    }
  }).sort({ timestamp: 1 });
};

const GPS = mongoose.model('GPS', gpsSchema);

module.exports = GPS; 
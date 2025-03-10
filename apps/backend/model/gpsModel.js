const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema({
  gpsId: {
    type: String,
    default: function() {
      return this._id.toString();
    }
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
  altitude: {
    type: Number,
    required: [true, 'Altitude is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Reference to the user who owns/operates the asset
  assetId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Asset',
    required: [true, 'GPS data must belong to an asset'],
    select: false
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "UserData",
    required: [true, "A gps data must belong to user"],
    select: false
  }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const GPS = mongoose.model('GPS', gpsSchema);

module.exports = GPS;
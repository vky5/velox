const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Asset name is required']
  },
  type: {
    type: String,
    required: [true, 'Asset type is required'],
    enum: ['machinery', 'equipment', 'package'] // Updated asset types
  },
  gpsId: {
    type: String,
    required: [true, 'GPS ID is required'],
    unique: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserData',
    required: [true, 'Asset must belong to a user']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
assetSchema.virtual('locations', {
  ref: 'GPS',
  foreignField: 'assetId',
  localField: 'gpsId'
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset; 
const GPS = require('../model/gpsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const validateGpsId = catchAsync(async (req, res, next) => {
  const { gpsId } = req.params;
  
  const gps = await GPS.findById(gpsId);
  
  if (!gps) {
    return next(new AppError('No GPS device found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      valid: true
    }
  });
});

module.exports = {
  validateGpsId
}; 
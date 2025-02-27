const UserData = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getProfile = catchAsync(async (req, res, next) => {
  const user = await UserData.findById(req.user.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatepassword.",
        400,
      ),
    );
  }

  // 2) Filter unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "img",
    "phone",
    "address",
  );

  // 3) Update user document
  const updatedUser = await UserData.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

module.exports = {
  getProfile,
  updateProfile,
};

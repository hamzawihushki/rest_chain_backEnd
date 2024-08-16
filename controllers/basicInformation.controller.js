const asyncWrapper = require("../middlewares/asyncWrapper");
const Users = require("../models/users.model");
const basicInformation = require("../models/basicInformation.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const addBasicInformation = asyncWrapper(async (req, res, next) => {
  const { name, phone, street, open, close, nearbyLandmarks, user_ID } =
    req.body;
  const existingUser = await basicInformation.findOne({ name }); // Check if the email already exists in the database
  if (existingUser) {
    return next(
      res.status(400).json({
        status: "fail",
        message: "name already exists.",
        data: null,
        code: 400,
      })
    );
  }

  const newBasicInformation = new basicInformation({
    name,
    phone,
    street,
    open,
    close,
    nearbyLandmarks,
    user_ID,
  });

  // generate a JWT token for the user upon successful registration
  await newBasicInformation.save();
  res.status(201).json({
    status: "success",
    message: "new Basic Information created successfully.",
    data: {
      newBasicInformation,
    },
  });
});
const showBasicInformation = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const basicInformations = await basicInformation
    .find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  res.json({
    status: "success",
    data: {
      basicInformations,
    },
  });
};
// ///////////////////////////////
const updateMyBasicInfo = asyncWrapper(async (req, res) => {
  const { user_ID } = req.params;
  const basicInfoData = req.body;

  if (!user_ID) {
    return res.status(400).json({
      status: "fail",
      message: "User ID is required",
    });
  }

  try {
    let basicInfo;

    // Check if record exists
    if (basicInfoData._id) {
      // Update existing record
      basicInfo = await basicInformation.findByIdAndUpdate(
        basicInfoData._id,
        basicInfoData,
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      // Create new record
      basicInfo = new basicInformation({ ...basicInfoData, user_ID });
      await basicInfo.save();
    }

    res.json({
      status: "success",
      data: { newBasicInformation: basicInfo },
    });
  } catch (err) {
    console.error("Error saving basic information:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

module.exports = {
  addBasicInformation,
  showBasicInformation,
  updateMyBasicInfo,
};

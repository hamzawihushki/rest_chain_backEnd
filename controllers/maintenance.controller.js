const asyncWrapper = require("../middlewares/asyncWrapper");
const maintenance = require("../models/maintenance.model");

const addMaintenance = asyncWrapper(async (req, res, next) => {
  const { start, end, impact, price, comment, user_ID } = req.body;
  const newMaintenance = new maintenance({
    start,
    end,
    impact,
    price,
    comment,
    user_ID,
  });

  // generate a JWT token for the user upon successful registration
  await newMaintenance.save();
  res.status(201).json({
    status: "success",
    message: "new Basic Information created successfully.",
    data: {
      newMaintenance,
    },
  });
});
const showMaintenance = async (req, res) => {
  const allMaintenance = await maintenance.find({}, { __v: false });

  if (!allMaintenance)
    return res.status(404).json({
      status: "fail",
      message: "No maintenance found.",
    });

  res.json({
    status: "success",
    data: {
      allMaintenance,
    },
  });
};
const myMaintenance = async (req, res) => {
  const { user_ID } = req.params; // Get the restaurant ID from the request
  if (!user_ID) {
    return res.status(400).json({
      status: "fail",
      message: "Restaurant ID is required",
    });
  }

  try {
    // Find the menu for the given restaurant ID
    const myMaintenance = await maintenance.find({ user_ID: user_ID }); // Use 'findOne' for a single document

    if (!myMaintenance) {
      return res.status(404).json({
        status: "fail",
        message: "No maintenance found for this restaurant",
      });
    }

    res.json({
      status: "success",
      data: myMaintenance,
    });
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
module.exports = {
  addMaintenance,
  showMaintenance,
  myMaintenance,
};

const asyncWrapper = require("../middlewares/asyncWrapper");
const MyMenu = require("../models/myMenu.model");

const getMyMenu = async (req, res) => {
  const { user_ID } = req.params; // Get the restaurant ID from the request

  if (!user_ID) {
    return res.status(400).json({
      status: "fail",
      message: "user ID is required",
    });
  }

  try {
    // Find the menu for the given restaurant ID
    const menu = await MyMenu.find({ user_ID }); // Use 'findOne' for a single document

    if (!menu) {
      return res.status(404).json({
        status: "fail",
        message: "No menu found for this restaurant",
      });
    }

    res.json({
      status: "success",
      data: menu,
    });
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const addMyMenuItem = asyncWrapper(async (req, res, next) => {
  let { name, price, servingTime, avatar, user_ID } = req.body;

  const newItemMenu = new MyMenu({
    name,
    price,
    servingTime,
    avatar: avatar,
    user_ID,
  });
  await newItemMenu.save();

  res.status(201).json({
    status: "success",
    data: {
      newItemMenu,
    },
  });
});

const updateMyMenuItem = asyncWrapper(async (req, res) => {
  const { _id } = req.params;
  const { servingTime } = req.body;

  console.log("Updating menu item with ID:", _id);

  // Validate the servingTime field
  if (!Array.isArray(servingTime)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid data format. Serving time should be an array.",
    });
  }

  // Optionally: Validate the contents of servingTime if there are specific allowed values

  try {
    // Find the menu item by ID and update the servingTime field
    const updatedItem = await MyMenu.findByIdAndUpdate(
      _id,
      { servingTime },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        status: "fail",
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedMenuItem: updatedItem,
      },
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the menu item.",
    });
  }
});
const deleteItem = asyncWrapper(async (req, res) => {
  const item = await MyMenu.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({
      status: "fail",
      message: "item not found",
    }); // item not found, return a 404 error. 404 means the resource requested is not found. 400 means the request was malformed or invalid. 200 means the request was successful. 201 means the resource was created successfully. 500 means an error occurred on the server. 503 means the server is temporarily unavailable. 401 means the user is unauthorized to access the requested resource. 403 means the user is authorized, but not allowed to access the requested resource. 429 means the user has sent too many requests in a short period of time. 408 means the request took too long to complete. 304 means the requested resource hasn't changed since the last request. 206 means the requested range
  }

  res.json({
    status: "success",
    message: "item deleted successfully",
  });
});

module.exports = {
  getMyMenu,
  addMyMenuItem,
  //   editCourse,
  deleteItem,
  updateMyMenuItem,
};

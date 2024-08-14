const asyncWrapper = require("../middlewares/asyncWrapper");
const Menu = require("../models/menu.model");
require("dotenv").config();
const getMenu = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const menu = await Menu.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({
    status: "success",
    data: {
      menu,
    },
  });
};
// price, description, servingTime,
const addMenuItem = asyncWrapper(async (req, res, next) => {
  const { name, avatar } = req.body;
  console.log(avatar);
  if (!name) {
    return res.status(400).json({
      status: "fail",
      message: "name and avatar are required.",
      data: null,
      code: 400,
    });
  }

  const existingUser = await Menu.findOne({ name }); // Check if the name already exists in the database
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

  const newItemMenu = new Menu({
    name,
    avatar: req.file.filename,
  });

  await newItemMenu.save(); // Make sure to await the save operation

  console.log("Created course:", newItemMenu);
  res.status(201).json({
    status: "success",
    data: {
      name,
      avatar: "http://localhost:" + process.env.PORT + "/" + newItemMenu.avatar, // Ensure the avatar URL is correctly formatted
    },
  });
});

// const editCourse = asyncWrapper(async (req, res) => {
//   const { title, price } = req.body;
//   if (!title && !price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Title and price are required.",
//     });
//   }
//   const editCourse = await Course.findByIdAndUpdate(
//     { _id: req.params.id },
//     { title, price },
//     { new: true }
//   );
//   console.log("Updated course:", editCourse);
//   if (!editCourse) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Course not found",
//     });
//   }
//   editCourse.save();
//   res.status(200).json({
//     status: "success",
//     data: {
//       editCourse,
//     },
//   });
// });

// const deleteCourse = asyncWrapper(async (req, res) => {
//   const course = await Course.findByIdAndDelete(req.params.id);

//   if (!course) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Course not found",
//     }); // Course not found, return a 404 error. 404 means the resource requested is not found. 400 means the request was malformed or invalid. 200 means the request was successful. 201 means the resource was created successfully. 500 means an error occurred on the server. 503 means the server is temporarily unavailable. 401 means the user is unauthorized to access the requested resource. 403 means the user is authorized, but not allowed to access the requested resource. 429 means the user has sent too many requests in a short period of time. 408 means the request took too long to complete. 304 means the requested resource hasn't changed since the last request. 206 means the requested range
//   }

//   res.json({
//     status: "success",

//     message: "Course deleted successfully",
//   });
// });

module.exports = {
  getMenu,
  addMenuItem,
  //   editCourse,
  //   deleteCourse,
};

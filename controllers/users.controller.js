const asyncWrapper = require("../middlewares/asyncWrapper");
const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getUsers = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const users = await Users.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({
    status: "success",
    data: {
      users,
    },
  });
};
const addUser = asyncWrapper(async (req, res, next) => {
  const { fullName, email, password } = req.body;
  const existingUser = await Users.findOne({ email }); // Check if the email already exists in the database
  if (existingUser) {
    return next(
      res.status(400).json({
        status: "fail",
        message: "Email already exists.",
        data: null,
        code: 400,
      })
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving it to the database
  const newUser = new Users({
    fullName,
    email,
    password: hashedPassword,
  });

  // generate a JWT token for the user upon successful registration
  const token = generateJWT({
    _id: newUser._id,
    email: newUser.email,
  });
  newUser.token = await token;

  await newUser.save();
  res.status(201).json({
    status: "success",
    message: "User created successfully.",
    data: {
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        token: newUser.token,
      },
    },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return next(
      res.status(400).json({
        status: "fail",
        message: "Email and password are required.",
        data: null,
        code: 400,
      })
    );
  }
  // Check if the email exists in the database and if the password matches the stored hashed password
  const user = await Users.findOne({ email }, { __v: 0 }); // Find the user by email
  if (!user) {
    return next(
      res.status(404).json({
        status: "fail",
        message: "User not found.",
        data: null,
        code: 404,
      })
    );
  }

  const isMatch = await bcrypt.compare(password, user.password); // Compare the password entered by the user with the stored hashed password
  const token = await generateJWT({
    _id: user._id,
    email: user.email,
  }); // Generate a JWT token for the user upon successful login
  if (user && isMatch) {
    res.json({
      status: "success",
      message: "User logged in successfully.",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          token: token,
        },
      },
    });
  } else {
    return next(
      res.status(401).json({
        status: "fail",
        message: "somthing wrong.",
        data: null,
        code: 401,
      })
    );
  }
});

module.exports = {
  getUsers,
  addUser,
  login,
};

const express = require("express");
const userController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.route("/").get(userController.getUsers);
router.route("/register").post(userController.addUser);
router.route("/login").post(userController.login);

module.exports = router;

const express = require("express");
const router = express.Router();
const appError = require("../utils/appError");
const myMenu = require("../controllers/myMenu.controller");

const multer = require("multer"); // Multer for handling file uploads

const deskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination for uploaded files
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const name = `user-${Date.now()}.${ext}`;
    cb(null, name); // Set the file name
  },
});
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0]; // Get the file imageTypeension

  if (imageType === "image") {
    return cb(null, true); // Accept the file
  } else {
    return cb(appError.create("Only images are allowed", 400, ""), false); // Reject the file
  }
};

const upload = multer({
  storage: deskStorage,
  fileFilter: fileFilter,
}); // Set the destination for uploaded files

router.route("/:user_ID").get(myMenu.getMyMenu);
router.route("/add").post(upload.single("avatar"), myMenu.addMyMenuItem);
router.route("/:id").delete(myMenu.deleteItem);
router.route("/update/:_id").put(myMenu.updateMyMenuItem);
// router.route("/my-menu").get(menuController.getMyMenu);

module.exports = router;

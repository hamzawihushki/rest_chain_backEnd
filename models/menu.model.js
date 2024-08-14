const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: "upload/default-image.png",
    // validate: [validator.isURL, "Invalid URL format"]
  },
});

module.exports = mongoose.model("Menu", MenuSchema);

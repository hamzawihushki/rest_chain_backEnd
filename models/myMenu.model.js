const mongoose = require("mongoose");

const MyMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  servingTime: [
    {
      type: String,
    },
  ],

  avatar: {
    type: String,
    // validate: [validator.isURL, "Invalid URL format"]
  },
  user_ID: {
    type: String,
  },
});

module.exports = mongoose.model("MyMenu", MyMenuSchema);

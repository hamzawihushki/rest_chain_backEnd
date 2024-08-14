const mongoose = require("mongoose");
const validator = require("validator");

const BasicInformationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  street: {
    type: String,
  },
  open: {
    type: String,
  },
  close: {
    type: String,
  },
  nearbyLandmarks: [
    {
      type: String,
    },
  ],
  user_ID: {
    type: String,
  },
});

module.exports = mongoose.model("BasicInformation", BasicInformationSchema);

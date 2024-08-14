const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  fullName: { type: String },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  password: { type: String, required: true },
  token: { type: String },
});
module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
  },
  impact: {
    type: String,
  },
  price: {
    type: String,
  },
  comment: {
    type: String,
  },
  user_ID: {
    type: String,
  },
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const usersRouter = require("./routes/users.route");
const BasicInformationRouter = require("./routes/BasicInformation.route");
const menuRouter = require("./routes/menu.route");
const myMenuRouter = require("./routes/myMenu.route");
const maintenanceRouter = require("./routes/maintenance.route");
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", usersRouter);
app.use("/api/BasicInformation", BasicInformationRouter);
app.use("/api/menu", menuRouter);
app.use("/api/myMenu", myMenuRouter);
app.use("/api/maintenance", maintenanceRouter);

const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => console.log("Connected to MongoDB")); // Connect to MongoDB

app.use((error, req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: error.message,
  });
});
app.all("*", (req, res) => {
  res.status(404).json({
    code: 404,
    status: "error",
    message: "the requested API endpoint does not exist. ",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

module.exports = app;

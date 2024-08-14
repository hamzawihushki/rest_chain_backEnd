const express = require("express");

const maintenanceController = require("../controllers/maintenance.controller.js");

const router = express.Router();

router.route("/show").get(maintenanceController.showMaintenance);
router.route("/:user_ID").get(maintenanceController.myMaintenance);
router.route("/").post(maintenanceController.addMaintenance);

module.exports = router;

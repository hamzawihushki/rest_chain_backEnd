const express = require("express");

const basicInformationController = require("../controllers/basicInformation.controller");

const router = express.Router();

router.route("/show").get(basicInformationController.showBasicInformation);
router.route("/").post(basicInformationController.addBasicInformation);
router.route("/:user_ID").put(basicInformationController.updateMyBasicInfo);

module.exports = router;

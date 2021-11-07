const express = require("express");
require("dotenv").config();

const { getRobots, getRobotsById } = require("../controller/robotsController");

const router = express.Router();

router.get("/", getRobots);
router.get("/:idRobot", getRobotsById);

module.exports = router;

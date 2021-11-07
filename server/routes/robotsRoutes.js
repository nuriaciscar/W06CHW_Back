const express = require("express");

const { getRobots, getRobotsById } = require("../controller/robotsController");

const router = express.Router();

router.get("/", getRobots);
router.get("/robots/:idRobot", getRobotsById);

module.exports = router;

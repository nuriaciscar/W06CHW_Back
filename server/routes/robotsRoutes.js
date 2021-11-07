const express = require("express");
require("dotenv").config();

const {
  getRobots,
  getRobotsById,
  deleteRobotsById,
} = require("../controller/robotsController");

const router = express.Router();

router.get("/", getRobots);
router.get("/:idRobot", getRobotsById);
router.delete("/delete/:idRobot", deleteRobotsById);

module.exports = router;

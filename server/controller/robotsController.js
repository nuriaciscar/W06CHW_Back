const Robot = require("../../database/models/robots");

const getRobots = async (req, res) => {
  try {
    console.log("getRobots fn work");
    const robots = await Robot.find();
    res.json(robots);
  } catch (error) {
    res.send(error);
  }
};

const getRobotsById = async (req, res, next) => {
  const { idRobot } = req.params;
  try {
    const searchedRobot = await Robot.findById(idRobot);
    if (searchedRobot) {
      res.json(searchedRobot);
    } else {
      const error = new Error("Robot not found :(");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Not found";
    next(error);
  }
};

const deleteRobotsById = async (req, res, next) => {
  const { idRobot } = req.params;
  try {
    const deletedRobot = await Robot.findByIdAndDelete(idRobot);
    if (deletedRobot) {
      res.json(deletedRobot);
    } else {
      const error = new Error("Robot to delete not found :(");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    error.code = 400;
    error.message = "Cannot delete robot";
    next(error);
  }
};

module.exports = { getRobots, getRobotsById, deleteRobotsById };

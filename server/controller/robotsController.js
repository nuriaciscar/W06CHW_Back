const Robot = require("../../database/models/robots");

const getRobots = async (req, res) => {
  const robots = await Robot.find();
  res.json(robots);
};

const getRobotsById = async (req, res, next) => {
  const { _id } = req.params;
  try {
    const searchedRobot = await Robot.findById(_id);
    if (searchedRobot) {
      res.json(searchedRobot);
    } else {
      const error = new Error("Robot not found :(");
      error.code = 404;
      throw error;
    }
  } catch (error) {
    error.code(400);
    next(error);
  }
};

module.exports = { getRobots, getRobotsById };

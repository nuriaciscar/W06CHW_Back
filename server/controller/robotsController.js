const Robot = require("../../database/models/robots");

const getRobots = async (res, req) => {
  const robots = await Robot.find();
  res.json(robots);
};

module.exports = { getRobots };

const debug = require("debug")("robots:errors");
const chalk = require("chalk");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Not Found" });
};

const generalErrorHandler = (error, req, res, next) => {
  debug(chalk.green("An error happened", error.message));
  const message = error.code ? error.message : "Oh no :(";
  res.status(error.code || 500).json({ error: message });
};

module.exports = { notFoundErrorHandler, generalErrorHandler };

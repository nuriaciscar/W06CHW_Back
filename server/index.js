const chalk = require("chalk");
const morgan = require("morgan");
const express = require("express");
const debug = require("debug")("robots:server");

const app = express();

const initializeServer = (port) => {
  const server = app.listen(port, () => {
    debug(chalk.blueBright(`Listening to port ${port}`));
  });
  server.on("error", (error) => {
    debug(chalk.red("Error to initialize Server"));
    if (error.code === "EADDRIUNSE") {
      debug(chalk.red(`Port ${port} is already in use.`));
    }
  });
};

app.use(morgan("dev"));
app.use(express.json());

module.exports = initializeServer;

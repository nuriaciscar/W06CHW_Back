const chalk = require("chalk");
const morgan = require("morgan");
const express = require("express");
const debug = require("debug")("robots:server");
const cors = require("cors");
const robotsRoutes = require("./routes/robotsRoutes");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");

const app = express();
app.use(cors());

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

app.use("/robots", robotsRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = initializeServer;

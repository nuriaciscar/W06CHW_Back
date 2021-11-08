const chalk = require("chalk");
const morgan = require("morgan");
const express = require("express");
const bcrypt = require("bcrypt");
const debug = require("debug")("robots:server");
const cors = require("cors");
const robotsRoutes = require("./routes/robotsRoutes");
const { notFoundErrorHandler, generalErrorHandler } = require("./error");

const app = express();
app.use(cors());
const User = require("../database/models/users");

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

  (async () => {
    User.create({
      name: "nuria",
      username: "nunu",
      password: bcrypt.hash("1234password", 10),
    });
  })();
};

app.use(morgan("dev"));
app.use(express.json());

app.use("/robots", auth, robotsRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = initializeServer;

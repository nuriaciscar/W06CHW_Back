const chalk = require("chalk");
const morgan = require("morgan");
const express = require("express");
// const bcrypt = require("bcrypt");
const debug = require("debug")("robots:server");
const cors = require("cors");
const robotsRoutes = require("./routes/robotsRoutes");
const loginRoutes = require("./routes/loginRoutes");
const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middlewares/error");
const auth = require("./middlewares/auth");

const app = express();
app.use(cors());
// const User = require("../database/models/users");

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`connect: + ${port}`);
      debug(chalk.blueBright(`Listening to port ${port}`));
      resolve(server);
    });
    server.on("error", (error) => {
      debug(chalk.red("Error to initialize Server"));
      if (error.code === "EADDRIUNSE") {
        debug(chalk.red(`Port ${port} is already in use.`));
      }
      reject();
    });

    server.on("close", () => {
      debug(chalk.blue("Server disconnected"));
    });
  });

// (async () => {
//   User.create({
//     name: "nuria",
//     username: "nunu",
//     password: await bcrypt.hash("1234password", 10),
//   });
// })();

app.use(morgan("dev"));
app.use(express.json());

app.use("/robots", auth, robotsRoutes);
app.use("/user/login", loginRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };

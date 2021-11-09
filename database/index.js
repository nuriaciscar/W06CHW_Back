const debug = require("debug")("robots:database");

const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = (connectionString) =>
  new Promise((resolve, reject) => {
    // mongoose.set("toJSON", {
    //   virtuals: true,
    //   transform: (doc, ret) => {
    //     // eslint-disable-next-line no-underscore-dangle
    //     delete ret._id;
    //     // eslint-disable-next-line no-underscore-dangle
    //     delete ret.__v;
    //   },
    // });

    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.red("The database couldn't be started"));
        debug(chalk.red(error.message));
        reject();
        return;
      }
      debug(chalk.green("Connected to database"));
      resolve();
    });
    mongoose.connection.on("close", () => {
      debug(chalk.green("Disconnected of database"));
    });
  });

module.exports = { connectDB };

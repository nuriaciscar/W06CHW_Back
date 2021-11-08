const debug = require("debug")("robots:database");

const chalk = require("chalk");
const mongoose = require("mongoose");

const connectDB = () =>
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
    mongoose.connect(process.env.MONGO_DBSTRING, (error) => {
      if (error) {
        debug(chalk.red("The database couldn't be started"));
        debug(chalk.red(error.message));
        reject();
        return;
      }
      debug(chalk.green("Connected to database"));
      resolve();
    });
  });

module.exports = connectDB;

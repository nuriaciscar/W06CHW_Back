const chalk = require("chalk");
const morgan = require("morgan");
const express = require("express");
const debug = require("debug")("robots:server");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

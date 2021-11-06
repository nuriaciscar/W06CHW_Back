const { Schema, model } = require("mongoose");

const robotsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  features: {
    speed: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    stamina: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    creationDate: {
      type: Number,
      required: true,
    },
  },
});

const Robot = model("robot", robotsSchema, "robots");

module.exports = Robot;

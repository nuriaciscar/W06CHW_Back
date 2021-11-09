const express = require("express");
const { validate } = require("express-validation");
require("dotenv").config();

const router = express.Router();

const { loginUser } = require("../controller/userController");
const loginRequestSchema = require("../schemas/loginRequestSchema");

router.post("/", /* validate(loginRequestSchema) */ loginUser);

module.exports = router;

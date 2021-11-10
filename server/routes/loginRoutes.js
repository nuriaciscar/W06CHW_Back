const express = require("express");
const { validate } = require("express-validation");
require("dotenv").config();

const { loginUser } = require("../controller/userController");
const loginRequestSchema = require("../schemas/loginRequestSchema");

const router = express.Router();

router.post("/", validate(loginRequestSchema), loginUser);

module.exports = router;

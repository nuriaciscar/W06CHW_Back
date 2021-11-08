const express = require("express");
require("dotenv").config();

const router = express.Router();

const loginUser = require("../controller/userController");

router.post("/", loginUser);

module.exports = router;

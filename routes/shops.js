const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Op } = require("@sequelize/core");

dotenv.config();

const db = require("../models/index");
const { User, Preset } = db;

const router = express.Router();

module.exports = router;

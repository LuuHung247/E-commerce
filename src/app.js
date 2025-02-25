const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const { countConnect, checkOverload } = require("./Helpers/check.connect");
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
//init database
require("./Dbs/init.mongodb");
// countConnect();
// checkOverload();

//init routes

//handeling errors

module.exports = app;

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
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//init database
require("./Dbs/init.mongodb");
// countConnect();
// checkOverload();

//init routes
app.use("/", require("./Routes"));
//handeling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;

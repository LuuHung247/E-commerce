"use strict";

const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));

// router.get("", (req, res) => {
//   return res.status(200).json({
//     message: "Welcome to E-Com",
//   });
// });

module.exports = router;

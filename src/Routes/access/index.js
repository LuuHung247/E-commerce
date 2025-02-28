"use strict";

const express = require("express");
const accessController = require("../../Controllers/access.controller");
const router = express.Router();

//Sign Up
router.post("/shop/signup", accessController.signUp);

module.exports = router;

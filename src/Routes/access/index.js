"use strict";

const express = require("express");
const accessController = require("../../Controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../Auth/checkAuth");

//Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp));
//Login
router.post("/shop/login", asyncHandler(accessController.login));
module.exports = router;

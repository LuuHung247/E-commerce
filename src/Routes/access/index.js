"use strict";

const express = require("express");
const accessController = require("../../Controllers/access.controller");
const router = express.Router();
const asyncHandler = require("../../Helpers/asyncHandler");
const { authentication } = require("../../Auth/authUltils");

//Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp));
//Login
router.post("/shop/login", asyncHandler(accessController.login));
//Authentication
router.use(authentication);

//Logout
router.post("/shop/logout", asyncHandler(accessController.logout));
//Handle RefreshToken
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);
module.exports = router;

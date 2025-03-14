"use strict";

const express = require("express");
const productController = require("../../Controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../Helpers/asyncHandler");
const { authentication } = require("../../Auth/authUltils");

//Authentication
router.use(authentication);

//
router.post("", asyncHandler(productController.createProduct));
module.exports = router;

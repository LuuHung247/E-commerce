"use strict";

const express = require("express");
const productController = require("../../Controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../Helpers/asyncHandler");
const { authentication } = require("../../Auth/authUltils");

router.get("/search/:keySearch", asyncHandler(productController.searchProduct));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));
//Authentication
router.use(authentication);

//
router.post("", asyncHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);
// QUERY
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/publish/all",
  asyncHandler(productController.getAllPublishForShop)
);
module.exports = router;

"use strict";

const ProductService = require("../Services/product.service");
const { Created } = require("../Core/success.response");
class ProductController {
  createProduct = async (req, res, next) => {
    Created.create({
      message: "Create product success",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  //QUERY

  /**
   *@desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    Created.create({
      message: "Get list draft success",
      metadata: await ProductService.findAllDraftsForShop({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    Created.create({
      message: "Get list publish success",
      metadata: await ProductService.findAllPublishForShop({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    Created.create({
      message: "Publish Product success",
      metadata: await ProductService.publishProductByShop({
        ...req.body,
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    Created.create({
      message: "UnPublish Product success",
      metadata: await ProductService.unPublishProductByShop({
        ...req.body,
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  searchProduct = async (req, res, next) => {
    Created.create({
      message: "Search Product success",
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();

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

  findAllProducts = async (req, res, next) => {
    Created.create({
      message: "find All Product success",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    Created.create({
      message: "find Product success",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    console.log("Params received:", req.params);
    Created.create({
      message: "update Product success",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();

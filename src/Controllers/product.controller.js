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
}

module.exports = new ProductController();

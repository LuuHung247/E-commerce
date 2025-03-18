"use strict";

const { lowerCase } = require("lodash");
const { model, Schema } = require("mongoose");
const slugify = require("slugify");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },

    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },

    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      //Round 1 so thap phan
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublish: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
// Search index
productSchema.index({ product_name: "text", product_description: "text" });
//Document middleware runs before .save() and create()
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//define the product type = clothing

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    size: String,
    material: String,
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

//define the product type = electronic

const electronicSchema = new Schema(
  {
    manufactor: {
      type: String,
      require: true,
    },
    model: String,
    color: String,
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);
//define the product type = furniture
const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    size: String,
    material: String,
  },
  {
    collection: "Furnitures",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicSchema),
  furniture: model("Furnitures", furnitureSchema),
};

"use strict";

const shopModel = require("../Models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../Auth/authultils");
const { clearScreenDown } = require("readline");

const shopRole = {
  SHOP: "001",
  WRITER: "002",
  EDITOR: "003",
  ADMIN: "004",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //step1: checkk email exists?
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: "xxx",
          message: "Email already registered",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [shopRole.SHOP],
      });

      if (newShop) {
        // Create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });
        console.log({ privateKey, publicKey }); //Save to collection KeyStore

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKey error",
          };
        }

        //Create token pair
        const tokens = await createTokensPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        console.log(`Created token success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }
      return {
        code: "xxx",
        metadata: null,
      };
    } catch (error) {
      return {
        code: "100",
        message: error.message,
        status: "error",
      };
    }
  };
}
module.exports = AccessService;

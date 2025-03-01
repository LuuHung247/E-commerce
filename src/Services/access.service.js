"use strict";

const shopModel = require("../Models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../Auth/authUltils");
const { clearScreenDown } = require("readline");
const { getInfoData } = require("../Ultils");

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
        // Using RSA algorithm

        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   // Public key CryptoGraphy Standard 1
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        console.log({ privateKey, publicKey }); //Save to collection KeyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "KeyStore error",
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
            shop: getInfoData({
              fileds: ["_id", "name", "email"],
              object: newShop,
            }),
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

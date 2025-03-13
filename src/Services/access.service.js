"use strict";

const shopModel = require("../Models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair, verifyJWT } = require("../Auth/authUltils");
const { clearScreenDown } = require("readline");
const { getInfoData } = require("../Ultils");
const {
  BadRequestError,
  AuthFailureError,
  ForbidenError,
} = require("../Core/error.response");
//Service
const { findByEmail } = require("./shop.service");

const RoleShop = {
  Shop: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
const shopRole = {
  SHOP: "001",
  WRITER: "002",
  EDITOR: "003",
  ADMIN: "004",
};

function createKeys() {
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
  return {
    privateKey: crypto.randomBytes(64).toString("hex"),
    publicKey: crypto.randomBytes(64).toString("hex"),
  };
}
class AccessService {
  static signUp = async ({ name, email, password }) => {
    //step1: checkk email exists?
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [shopRole.SHOP],
    });

    if (newShop) {
      const { privateKey, publicKey } = createKeys();
      console.log({ privateKey, publicKey }); //Save to collection KeyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("KeyStore error");
      }

      //Create token pair
      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log(`Created token success::`, tokens);
      return {
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };
  /*
  Step 1 : Check email in dbs
  Step 2 : Match password in dbs
  Step 3 : Create accessToken and refreshToken and save
  Step 4 : Generate Tokens
  Step 5 : Get data return login

  */
  static login = async ({ email, password, refreshToken = null }) => {
    // Step 1 : Check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Email is not registered");
    //  Step 2 : Match password in dbs
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error");
    //  Step 3 : Create accessToken and refreshToken and save
    const { privateKey, publicKey } = createKeys();
    console.log({ privateKey, publicKey }); //Save to collection KeyStore
    // Step 4 : Generate Tokens

    const tokens = await createTokensPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      metadata: {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };
  //Check token used
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefershTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // Decode user
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log(userId, email);
      //Delete all Token
      await KeyTokenService.removeKeyById(userId);
      throw new ForbidenError("Some thing wrong happed !! Login Again");
    }

    const holderToken = await KeyTokenService.findByRefershToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("Shop not registered 1");

    //Verify Token
    // Decode user
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered 2");

    //Create new Token Pair
    const tokens = await createTokensPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    const oldRefreshToken = refreshToken;
    const newRefreshToken = holderToken.refreshToken;
    //update token

    await KeyTokenService.createNewRefreshToken(
      holderToken._id,
      oldRefreshToken,
      newRefreshToken
    );

    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;

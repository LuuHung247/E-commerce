"use strict";

const keyTokenModel = require("../Models/keyToken.model");
const ObjectId = require("mongoose").Types.ObjectId;

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //lv0
      // const tokens = await KeyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshToken, refreshTokensUsed: [] },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete(new ObjectId(id)).lean();
  };
  static findByRefershTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefershToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken }).lean();
  };

  static async createNewRefreshToken(keyId, oldRefreshToken, newRefreshToken) {
    return await keyTokenModel.findByIdAndUpdate(keyId, {
      $set: { refreshToken: newRefreshToken },
      $addToSet: { refreshTokensUsed: oldRefreshToken },
    });
  }
}
module.exports = KeyTokenService;

"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../Helpers/asyncHandler");
const { AuthFailureError } = require("../Core/error.response");
const { findByUserId } = require("../Services/keyToken.service");
const { keys } = require("lodash");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};
const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    // Aceess Token
    const accessToken = JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    // Verrify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1-Check userId missing ?
  2-Get accessToken
  3-verify Token
  4- check user in dbs
  5- check keyStore with this userId ?
  6-ok all = > return next()
  */
  console.log("Headers received:", req.headers);

  const userId = req.headers[HEADER.CLIENT_ID];
  //1
  if (!userId) throw new AuthFailureError("Invalid request - No userID");
  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new AuthFailureError("Not found keyStore");
  //3
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      console.log(`decode user:`, decodeUser);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid UserId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken)
    throw new AuthFailureError("Invalid request - No accessToken");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  createTokensPair,
  authentication,
  verifyJWT,
};

"use strict";

const JWT = require("jsonwebtoken");
const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    // Aceess Token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refressToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
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

    return { accessToken, refressToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokensPair,
};

"use strict";

const AccessService = require("../Services/access.service");
const { OK, Created } = require("../Core/success.response");
class AccessController {
  //Sign Up

  static async login(req, res, next) {
    Created.create({
      message: "Login OK",
      metadata: await AccessService.login(req.body),
    }).send(res);
  }
  //Login
  static async signUp(req, res, next) {
    Created.create({
      message: "Registed OK",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }
  //Logout
  static async logout(req, res, next) {
    Created.create({
      message: "Logout OK",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }

  //Handle Refresh Token
  static async handleRefreshToken(req, res, next) {
    Created.create({
      message: "RefreshToken OK",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  }
}

module.exports = AccessController;

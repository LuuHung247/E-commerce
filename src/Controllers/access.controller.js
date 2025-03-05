"use strict";

const AccessService = require("../Services/access.service");
const { OK, Created, SuccessResponse } = require("../Core/success.response");
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
}

module.exports = AccessController;

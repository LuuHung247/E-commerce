"use strict";

const AccessService = require("../Services/access.service");

class AccessController {
  //Sign Up
  static async signUp(req, res, next) {
    try {
      console.log(`[P]::signUP::`, req.body);

      return res.status(200).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AccessController;

"use strict";

const { findById } = require("../Services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "Authorization",
};
const checkApiKey = async (req, res, next) => {
  try {
    //Check apiKey exist in Request Header
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // Check objKey exist in Database
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

//Check permission off the objKey
const checkPermission = (permission) => {
  return (req, res, next) => {
    //Check if permission exist in objKey
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    console.log("Permission of objKey: ", req.objKey.permissions);
    //Check if permission valid
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    return next();
  };
};

const asyncHandler = (fnc) => {
  return (req, res, next) => {
    fnc(req, res, next).catch(next);
  };
};
module.exports = { checkApiKey, checkPermission, asyncHandler };

"use strict";

const apiKeyModel = require("../Models/apiKey.model");
const crypto = require("crypto");

const findById = async (key) => {
  // createApiKey(["READ", "WRITE", "DELETE"]);
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

const createApiKey = async (keyPermissions = ["READ"]) => {
  try {
    const newKey = await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: keyPermissions,
    });
    console.log("New API Key:", newKey);
  } catch (error) {
    console.error("Error create API Key:", error);
  }
};
module.exports = {
  findById,
};

"use strict";

const express = require("express");
const router = express.Router();
const { checkApiKey, checkPermission } = require("../Auth/checkAuth");
//check apiKey
router.use(checkApiKey);
//check permission
router.use(checkPermission("READ"));

router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));
module.exports = router;

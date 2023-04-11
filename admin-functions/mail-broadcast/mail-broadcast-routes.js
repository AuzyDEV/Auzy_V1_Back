const express = require("express");
const { sendBroadcastMailOverHTTP } = require("./mail-broadcast-controller");
const router = express.Router();
router.post("/sendbroadmail", sendBroadcastMailOverHTTP);

module.exports = {
    routes: router
  };
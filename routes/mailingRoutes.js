const express = require("express");
const { sendMailOverHTTP, sendBroadcastMailOverHTTP } = require("../controllers/mailingController");

const router = express.Router();

router.post("/send", sendMailOverHTTP);
router.post("/sendbroadmail", sendBroadcastMailOverHTTP);

module.exports = {
    routes: router
  };
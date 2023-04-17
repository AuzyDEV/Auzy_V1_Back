const express = require("express");
const { sendMailOverHTTP } = require("./contact-us-controller");
const router = express.Router();
router.post("/send", sendMailOverHTTP);
module.exports = {routes: router};
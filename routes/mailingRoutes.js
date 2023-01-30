const express = require("express");
const { sendMailOverHTTP } = require("../controllers/mailingController");

const router = express.Router();

router.post("/send", sendMailOverHTTP);

module.exports = {
    routes: router
  };
const express = require("express");
const { sendResetEmail } = require("./forgot-password-controller");
const router = express.Router();
router.post("/resetemail", sendResetEmail);

module.exports = {
  routes: router
};
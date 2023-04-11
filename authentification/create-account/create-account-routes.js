const express = require("express");
const { signUp } = require("./create-account-controller");
const router = express.Router();
router.post("/register", signUp);

module.exports = {
    routes: router
  };
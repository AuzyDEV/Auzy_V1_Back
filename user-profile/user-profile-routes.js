const express = require("express");
const {sendVerificationEmail, getCurrentUser} = require("./user-profile-controller");
const router = express.Router();
router.get("/currentuser", getCurrentUser);
router.post("/confirmemail", sendVerificationEmail);
module.exports = {routes: router};
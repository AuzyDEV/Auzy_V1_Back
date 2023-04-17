const express = require("express");
const { sendNotification, } = require("./notifications-controller");
const router = express.Router();
router.post("/sendnotif", sendNotification);
module.exports = {routes: router};
const express = require("express");
const {
    sendNotification, sendMailOverHTTP,
} = require("../controllers/notificationsController");
 
const router = express.Router();
router.post("/sendnotif", sendNotification);
router.post("/send", sendMailOverHTTP);
module.exports = {
    routes: router
  };
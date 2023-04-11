const express = require("express");
const multer = require('multer');
const { sendNotification, } = require("./notifications-controller");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const router = express.Router();
router.post("/sendnotif", sendNotification);
module.exports = {
    routes: router
  };
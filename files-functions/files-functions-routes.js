const express = require("express");
const multer = require('multer');
const {deleteFileFromDownloadURLForPost}= require("./file-functions-controller");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const router = express.Router();
router.delete("/filepost", deleteFileFromDownloadURLForPost);
module.exports = {routes: router};
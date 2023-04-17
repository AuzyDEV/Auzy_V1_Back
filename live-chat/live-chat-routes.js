const express = require("express");
const { getAllMessages, getCountMessages, getCountMessagesByUserId } = require("./live-chat-controller");
const router = express.Router();
router.get("/numberofmessage", getCountMessages);
router.get("/msg/:idUser", getAllMessages);
router.get("/nbr/:idUser", getCountMessagesByUserId);
module.exports = {routes: router};
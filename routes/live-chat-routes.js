const express = require("express");
const { getAllMessages, getCountMessages, getCountMessagesByUserId } = require("../controllers/live-chat-controller");
const { sendMailOverHTTP } = require("../controllers/notifications-controller");

const router = express.Router();

router.get("/numberofmessage", getCountMessages);
router.get("/msg/:idUser", getAllMessages);
router.get("/nbr/:idUser", getCountMessagesByUserId);


module.exports = {
  routes: router
};
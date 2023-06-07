const express = require("express");
const { getAllMessages, getCountMessages, getCountMessagesByUserId, getAllUsersThatSendMsgForASpecificAssistant, addDiscussionAssUser, getAllMessagesByColleactionPath } = require("./live-chat-controller");
const router = express.Router();
router.get("/numberofmessage", getCountMessages);
router.get("/msg/:idUser", getAllMessages);
router.get("/nbr/:idUser", getCountMessagesByUserId);
router.post("/addiscuAssi/:assId/:cusId", addDiscussionAssUser)
router.get("/listusersbyAssi/:assId", getAllUsersThatSendMsgForASpecificAssistant);
router.get("/getMessages/:chatDocId/:discussionsDocId", getAllMessagesByColleactionPath);
module.exports = {routes: router};
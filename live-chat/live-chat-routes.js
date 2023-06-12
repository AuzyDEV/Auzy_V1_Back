const express = require("express");
const { getAllMessages, getCountMessagesByUserId, getAllUsersThatSendMsgForASpecificAssistant, addDiscussionAssUser, getAllMessagesByColleactionPath, uploadNewMessage } = require("./live-chat-controller");
const router = express.Router();
router.post("/uploadmsg/:currentUserId/:assistantId", uploadNewMessage)
router.get("/msg/:idUser", getAllMessages);
router.get("/nbr/:idUser", getCountMessagesByUserId);
router.post("/addiscuAssi/:assId/:cusId", addDiscussionAssUser)
router.get("/listusersbyAssi/:assId", getAllUsersThatSendMsgForASpecificAssistant);
router.get("/getMessages/:chatDocId/:discussionsDocId", getAllMessagesByColleactionPath);
module.exports = {routes: router};
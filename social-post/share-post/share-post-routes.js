const express = require("express");
const { SharePost, getAllSharedPostsByCurrentUserId } = require("./share-post-controller");
const router = express.Router();
router.post("/sharepost", SharePost);
router.get("/sharedposts/:idSharedUser", getAllSharedPostsByCurrentUserId)
module.exports = { routes: router};
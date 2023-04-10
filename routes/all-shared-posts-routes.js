const express = require("express");
const { SharePost, getAllSharedPostsByCurrentUserId } = require("../controllers/share-posts-controller");
const router = express.Router();
router.post("/sharepost", SharePost);
router.get("/sharedposts/:idSharedUser", getAllSharedPostsByCurrentUserId)
module.exports = {
    routes: router
  };
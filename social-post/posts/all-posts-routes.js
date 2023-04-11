const express = require("express");
const { getPostsForUsers, getAllPostsAndTheirFiles, getOnePostWithFileDetails, getSavedPostWithBoolAttributeAndTheirFiles,} = require("./all-posts-controller");
const router = express.Router();
router.get("/saved/:currentUserId", getSavedPostWithBoolAttributeAndTheirFiles);
router.get("/postsforusers", getPostsForUsers);
router.get("/allposts", getAllPostsAndTheirFiles);
router.get("/post/:id", getOnePostWithFileDetails);
module.exports = {
    routes: router
  };
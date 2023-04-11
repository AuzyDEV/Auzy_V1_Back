const express = require("express");
const { SavePost, getAllSavedPosts, deleteSavedPost, countSavedPosts, getAllSavedPostsAndTheirFiles } = require("./saved-posts-controller");
const router = express.Router();
router.post("/savepost", SavePost);
router.get("/savedposts/:currentUserId", getAllSavedPostsAndTheirFiles);
router.delete("/savedpost/:id", deleteSavedPost);
router.get("/countsavedPosts/:currentUserId", countSavedPosts);
module.exports = {
    routes: router
  };
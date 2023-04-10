const express = require("express");
const { addPost, getAllPosts, updatePost, deletePost, updatePostVisisbilityToFalse, updatePostVisibilityToTrue, getPostsForUsers, getAllPostsAndTheirFiles, getOnePostWithFileDetails, getSavedPostWithBoolAttributeAndTheirFiles,} = require("../controllers/all-posts-controller");
const router = express.Router();
router.post("/addpost", addPost);
router.get("/posts", getAllPosts);
router.get("/saved/:currentUserId", getSavedPostWithBoolAttributeAndTheirFiles);
router.get("/postsforusers", getPostsForUsers);
router.get("/allposts", getAllPostsAndTheirFiles);
router.get("/post/:id", getOnePostWithFileDetails);
router.put("/post/:id", updatePost);
router.put("/postvisibilityfalse/:id", updatePostVisisbilityToFalse);
router.put("/postvisibilitytrue/:id", updatePostVisibilityToTrue)
router.delete("/post/:id", deletePost);
module.exports = {
    routes: router
  };
const express = require("express");
const { addPost, getAllPosts, updatePost, updatePostVisisbilityToFalse, updatePostVisibilityToTrue, deletePost } = require("./post-management-controller");
const router = express.Router();
router.post("/addpost", addPost);
router.get("/posts", getAllPosts);
router.put("/post/:id", updatePost);
router.put("/postvisibilityfalse/:id", updatePostVisisbilityToFalse);
router.put("/postvisibilitytrue/:id", updatePostVisibilityToTrue)
router.delete("/post/:id", deletePost);
module.exports = {routes: router};
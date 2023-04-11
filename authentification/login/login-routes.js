const express = require("express");const { login, logout, signInWithFacebook, signInWithGoogle } = require("./login-controller");
const router = express.Router();
router.post("/login", login);
router.get("/logout", logout);
router.post("/logingoogle", signInWithGoogle);
router.post("/loginfacebook", signInWithFacebook);

module.exports = {
  routes: router
};
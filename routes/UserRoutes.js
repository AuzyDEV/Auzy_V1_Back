const express = require("express");
const { sendMailOverHTTP } = require("../controllers/notificationsController");
const {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout,
  signInWithGoogle,
  signInWithFacebook,
  sendResetEmail,
  sendVerificationEmail,
  listAllUsers,
  getUserwWithEmail,
  getUserInfos,
  updateUserinfos,
  deleteOneUser,
  get,
  getCurrentUser,
  updateUserpassword,
  ipMiddleware,
  getUserInfoswithIpAdress,
  deleteAllUsers,
  blockUser,
  restoreUser,
  countUsers,
  signUp,
  getListUsers,
} = require("../controllers/UserController");
 
const router = express.Router();
 
// register user
router.post("/register", signUp);
// login user
router.post("/login", login);
// logout user
router.get("/logout", logout);
// get current user
router.get("/currentuser", getCurrentUser);
//login with google account
router.post("/logingoogle", signInWithGoogle);
// login with facebook account
router.post("/loginfacebook", signInWithFacebook);
// reset password & send email reset
router.post("/resetemail", sendResetEmail);
// send verification email for register
router.post("/confirmemail", sendVerificationEmail);
router.get("/userss", listAllUsers);
// get all users
router.get("/get", getListUsers);
router.get("/getnumberofusers", function(req, res){
  countUsers(0).then(count => res.status(200).json({count: count}));
});
// get user with email adress
router.get("/user/:email", getUserwWithEmail);
//get user infos : email & password
router.get("/userinfos/:uid", getUserInfos);
// get user's infos (collection) : ipadress & bloc
router.get("/userinfoswithipadress/:uid", getUserInfoswithIpAdress);
// update user's infos
router.put("/userinfo/:uid", updateUserinfos);
// update user's password
router.put("/userpassword", updateUserpassword);
// delete one user by id
router.delete("/userinfo/:uid", deleteOneUser);
// delete all users
router.delete("/deleteallusers", deleteAllUsers);
// get user's ip adress
router.get("/ipadress", ipMiddleware);
router.post("/user", addUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
// block user
router.put("/blocuser/:uid", blockUser);
// restore user from blocked list
router.put("/restoreuser/:uid", restoreUser);

module.exports = {
  routes: router
};
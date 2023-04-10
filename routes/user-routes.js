const express = require("express");
const {addUser,getAllUsers,getUser, updateUser,deleteUser,login,logout,signInWithGoogle, signInWithFacebook,sendResetEmail,sendVerificationEmail,getUserwWithEmail,getUserInfos,updateUserinfos,deleteOneUser,getCurrentUser,updateUserpassword,getUserInfoswithIpAdress,deleteAllUsers,blockUser,restoreUser,countUsers,signUp,getListUsers,getUserRole,getListofUsersWithRoleUser,} = require("../controllers/user-controller");
const router = express.Router();
router.post("/register", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/currentuser", getCurrentUser);
router.post("/logingoogle", signInWithGoogle);
router.post("/loginfacebook", signInWithFacebook);
router.post("/resetemail", sendResetEmail);
router.post("/confirmemail", sendVerificationEmail);
router.get("/get", getListUsers);
router.get("/getnumberofusers", function(req, res){countUsers(0).then(count => res.status(200).json({count: count}));});
router.get("/user/:email", getUserwWithEmail);
router.get("/userinfos/:uid", getUserInfos);
router.get("/userinfoswithipadress/:uid", getUserInfoswithIpAdress);
router.put("/userinfo/:uid", updateUserinfos);
router.put("/userpassword", updateUserpassword);
router.delete("/userinfo/:uid", deleteOneUser);
router.delete("/deleteallusers", deleteAllUsers);
router.post("/user", addUser);
router.get("/users", getAllUsers);
router.get("/user/:id", getUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.put("/blocuser/:uid", blockUser);
router.put("/restoreuser/:uid", restoreUser);
router.get("/userole/:uid", getUserRole);
router.get('/usersrole', getListofUsersWithRoleUser)

module.exports = {
  routes: router
};
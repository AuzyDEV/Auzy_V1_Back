const express = require("express");
const { getUserInfos, getUserInfoswithIpAdress, updateUserinfos, updateUserpassword, deleteOneUser, deleteAllUsers, blockUser, restoreUser, getUserRole, getListofUsersWithRoleUser, getListUsers } = require("./user-management-controller");
const router = express.Router();
router.get("/userinfos/:uid", getUserInfos);
router.get("/userinfoswithipadress/:uid", getUserInfoswithIpAdress);
router.put("/userinfo/:uid", updateUserinfos);
router.put("/userpassword", updateUserpassword);
router.delete("/userinfo/:uid", deleteOneUser);
router.delete("/deleteallusers", deleteAllUsers);
router.put("/blocuser/:uid", blockUser);
router.put("/restoreuser/:uid", restoreUser);
router.get("/userole/:uid", getUserRole);
router.get('/usersrole', getListofUsersWithRoleUser)
router.get("/get", getListUsers);

module.exports = {
  routes: router
};
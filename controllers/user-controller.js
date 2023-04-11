const firebase = require("../db");
const User  = require("../admin-functions/user-management/user-management-model.js");
const fireStore = firebase.firestore();
const firebasee = require('firebase');
const { getAuth, UserRecord } = require('firebase-admin/auth');
const requestIp = require('request-ip');

let users = [];


const sendVerificationEmail = async (req, res, next) => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => { 
    res.status(200).json({ message: "email adress confirmation send!" });
    }).catch((error) => {
    res.status(400).json({ message: error.message });
    });
}
const getCurrentUser = async (req, res, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var uid = user.uid;
      res.status(200).json([user]);
    } else {
      res.status(400).json({ message: "User is signed out" });
    }
  });
}

 async function countUsers(count) {
  const listUsersResult = await getAuth().listUsers(1000);
  listUsersResult.users.map(user => {
    if (new Date(user.metadata.creationTime) < new Date("2023-01-12T00:00:00")) {
      count++;
    }});
  if (listUsersResult.pageToken) {
    count = await countUsers(count, listUsersResult.pageToken);
  }
  return count;}




module.exports = {
    getCurrentUser,
    sendVerificationEmail,
    countUsers,
  }
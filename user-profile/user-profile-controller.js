const firebase = require("../config/db");
const { getAuth} = require('firebase-admin/auth');
const sendVerificationEmail = async (res) => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => { 
    res.status(200).json({ message: "email adress confirmation send!" });
  }).catch((error) => {
    res.status(400).json({ message: error.message });
  });
}
const getCurrentUser = async (res) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
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
  return count;
}
module.exports = {getCurrentUser, sendVerificationEmail, countUsers,}


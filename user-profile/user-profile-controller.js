const firebase = require("../config/db");
const { getAuth} = require('firebase-admin/auth');
const { errorResponse, successResponse } = require("../config/response");
const sendVerificationEmail = async (req, res) => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => { 
    successResponse.send(res, "email adress confirmation send!")
  }).catch((error) => {
    errorResponse.send(res, error.message);
  });
}
const getCurrentUser = async (req, res) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      successResponse.send(res, [user])
      res.status(200).json([user]);
    } else {
      errorResponse.send(res, "User is signed out");
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


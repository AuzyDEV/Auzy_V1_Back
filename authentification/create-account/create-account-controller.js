const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const { getAuth} = require('firebase-admin/auth');
const {errorResponse, errorUnauthorised, errorServer, errorNotFound, successResponse} = require("../../config/response")

const signUp = async (req, res) => {
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
  .then((userCredential) => {
    var user = userCredential.user;
    user.sendEmailVerification().then(() => {
      fireStore.collection("users").doc(user.uid).set({ipadress: req.body.ipadress,role: "user"})
      getAuth().updateUser(user.uid, {displayName: req.body.displayName,photoURL: req.body.photoURL,})
      .then((userRecord) => {
        const combinedData = {
          result: "User registred & email send successfully",
          data: user.uid
        };
        successResponse.send(res, combinedData)
      })
      .catch((error) => {
        errorResponse.send(res, error.message ); 
      });
    })
    .catch((error) => {
      errorUnauthorised.send(res, error.message)
    });
  }).catch((error) => {
      if (error.code === 'auth/email-already-in-use')
        errorResponse.send(res, {result: error.message,data: null}); 
      else
        errorServer.send(res, error.message);
    });
}

module.exports = {signUp}
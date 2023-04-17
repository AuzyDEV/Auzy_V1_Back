const firebase = require("../../config/db");
const fireStore = firebase.firestore();
const { getAuth} = require('firebase-admin/auth');
const signUp = async (req, res) => {
  firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
  .then((userCredential) => {
  var user = userCredential.user;
  user.sendEmailVerification().then(() => {
    fireStore.collection("users").doc(user.uid).set({ipadress: req.body.ipadress,role: "user"})
    getAuth().updateUser(user.uid, {displayName: req.body.displayName,photoURL: req.body.photoURL,})
    .then((userRecord) => {
      console.log(JSON.stringify(userRecord))
      res.status(200).json({ message: "User registred & email send successfully" });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message});
      });
    }).catch((error) => {
        res.status(401).json({ message: error.message });
    });
  }).catch((error) => {
    if (error.code === 'auth/email-already-in-use')
      res.status(400).json({ message: error.message });
    else
      res.status(500).json({ message: error.message });
  });}
module.exports = {signUp,}
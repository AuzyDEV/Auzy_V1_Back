const firebase = require("../../config/db");
const firebasee = require('firebase');
const login = async (req, res) => {
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(async (userCredential) => {
  firebase.auth().onAuthStateChanged(
    async function(user) {
      if(user.emailVerified == true){
        token = await userCredential.user.getIdToken();
        console.log(token)
      res.status(200).json({ message: "User signin successfully", data: token });
    }
    else {
      res.status(404).json({ message: "no confirmation email" });
    }})
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found')
      res.status(400).json({ message: error.message });
    else
    res.status(500).json({ message: error.message });
});}

const logout = async (req, res) => {
  firebase.auth().signOut().then(() => {
    res.status(200).json({ message: "User logout successfully" });
  }).catch((error) => {
    res.status(400).json({ message:  error.message });
  });}

const signInWithGoogle = async (req, res) => {
  var provider = new firebasee.auth.GoogleAuthProvider();
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    res.status(200).json({ message: "User signin google successfully" });
  }).catch((error) => {
    res.status(400).json({ message: error.message});
  });}

const signInWithFacebook = async (req, res) => {
  var provider = new firebasee.auth.FacebookAuthProvider();
  firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    // The signed-in user info.
    var user = result.user;
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;
    res.status(200).json({ message: "User signin facebook successfully" });
  }) .catch((error) => {
    res.status(400).json({ message: error.message});
  });}
module.exports = {login, logout, signInWithGoogle, signInWithFacebook,}
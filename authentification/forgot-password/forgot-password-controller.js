const firebase = require("../../db");
const sendResetEmail = async (req, res, next) => {
  firebase.auth().sendPasswordResetEmail(req.body.email).then(() => { 
    res.status(200).json({ message: "email reset password send!" });
  }).catch((error) => {
    res.status(400).json({ message: error.message});
});}
module.exports = {sendResetEmail,}
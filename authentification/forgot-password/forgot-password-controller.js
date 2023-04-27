const { successResponse } = require("../../config/response");
const firebase = require("../../config/db");
const sendResetEmail = async (req, res, next) => {
  firebase.auth().sendPasswordResetEmail(req.body.email).then(() => { 
    successResponse.send(res, "email reset password send!")
  }).catch((error) => {
    errorResponse.send(res, error.message );
});}
module.exports = {sendResetEmail,}
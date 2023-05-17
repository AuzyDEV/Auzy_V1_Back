const functions = require('firebase-functions');
const sendEmail = require('../config/email');
const { errorResponse, successResponse } = require('../config/response');
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

const sendMailOverHTTP = functions.https.onRequest(async (req, res) => {
  try {
    await sendEmail({
      from: req.body.email,
      email: `goapp.auzy@gmail.com`,
      subject: 'Contact Form Message',
      html: `<h1>Contact Form Message</h1>
              <p><b>User's email: </b>${req.body.email}<br>
              <b>User's name: </b>${req.body.name}<br>
              <b>User's mobile: </b>${req.body.mobile}<br>
              <b>Message: </b>${req.body.message}<br></p>`
    });
  successResponse.send(res, "email send!")
  } catch (error) {
    errorResponse.send(res, error.message);
  }
});

module.exports = {sendMailOverHTTP,}
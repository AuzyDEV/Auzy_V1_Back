const nodemailer = require('nodemailer');
const functions = require('firebase-functions');
const sendEmail = require('../config/email');
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
     var data = JSON.stringify(data)
     return res.status(200).json({ message: "email send!" });
   } catch (error) {
     return res.status(400).json({ message: error.message });
   }
  });


module.exports = {
    sendMailOverHTTP,
  }
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const functions = require('firebase-functions')
const firebase = require("../db");
const storage = firebase.storage().ref();
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'haifatanazefti88@gmail.com',
      pass: 'mxddrzmekqzhndjc'
  }
});

// send email for contact us
const sendMailOverHTTP = functions.https.onRequest((req, res) => {
  const mailOptions = {
      from: req.body.email,
      to: `haifatanazefti88@gmail.com`,
      subject: 'Contact Form Message',
      html: `<h1>Contact Form Message</h1>
                          <p>
                             <b>User's email: </b>${req.body.email}<br>
                             <b>User's name: </b>${req.body.name}<br>
                             <b>User's mobile: </b>${req.body.mobile}<br>
                             <b>Message: </b>${req.body.message}<br>
                          </p>`
  };
  return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
          return res.status(400).json({ message: error.message });
      }
      var data = JSON.stringify(data)
      return res.status(200).json({ message: "email send!" });
  });
});


module.exports = {
    sendMailOverHTTP,
  }
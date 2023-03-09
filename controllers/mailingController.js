const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const functions = require('firebase-functions')
const firebase = require("../db");
const { getAllUsersEmail } = require('./UserController');
const storage = firebase.storage().ref();
const { getAuth, UserRecord } = require('firebase-admin/auth');
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'goapp.auzy@gmail.com',
      pass: 'rwzthgwrjongnioe'
  }
});

// send email for contact us
const sendMailOverHTTP = functions.https.onRequest((req, res) => {
  const mailOptions = {
      from: req.body.email,
      to: `goapp.auzy@gmail.com`,
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


// send email for contact us
const sendBroadcastMailOverHTTP = functions.https.onRequest((req, res) => {
  let _users_list = [];
  //let recipients = [];
  //recipients = getAllUsersEmail();
  //console.log(recipients);
  //const recipients = ['haifatanazefti97@gmail.com', 'haifatanazefti88@gmail.com'];
  // Get all users from Firebase
  getAuth()
    .listUsers(1000)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        _users_list.push(userRecord.email)
        console.log(_users_list);
      });
    });
  const mailOptions = {
    from: 'goapp.auzy@gmail.com',
    to: _users_list,
    subject: 'Announcement',
    html: `<h1>📢 For all users</h1>
    <p>
       <b>Message: </b>${req.body.message}<br>
       <b> Get your chance </b> <br>
       <img src="https://t3.ftcdn.net/jpg/03/13/59/86/360_F_313598699_jyO0OFvaccHWe9YsAY1s8Ycpf0qVPIVz.jpg" alt="https://auzy.help/">  <br>
    </p>`
  };
  return transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(200).json({ message: "email send!" });
    }
  });
});

module.exports = {
    sendMailOverHTTP,
    sendBroadcastMailOverHTTP
  }
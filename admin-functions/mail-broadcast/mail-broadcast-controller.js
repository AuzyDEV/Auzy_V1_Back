const nodemailer = require('nodemailer');
const functions = require('firebase-functions')
const { getAuth, UserRecord } = require('firebase-admin/auth');
const sendEmail = require('../../config/email');
require("firebase/storage");
global.XMLHttpRequest = require("xhr2");


const sendBroadcastMailOverHTTP = functions.https.onRequest(async (req, res) => {
  let _users_list = [];
  getAuth()
    .listUsers(1000)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
      _users_list.push(userRecord.email)
    });
    });
    try {
     await sendEmail({
      from: 'AUZY <goapp.auzy@gmail.com>',
        email: _users_list,
        subject: 'Announcement',
        html: `<h1>📢 For all users</h1>
        <p><b>Message: </b>${req.body.message}<br>
           <b> Get your chance </b> <br>
           <img src="https://t3.ftcdn.net/jpg/03/13/59/86/360_F_313598699_jyO0OFvaccHWe9YsAY1s8Ycpf0qVPIVz.jpg" alt="https://auzy.help/">  <br>
        </p>`,
      });

      return res.status(200).json({ message: "email send!" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
 
});

module.exports = {
    sendBroadcastMailOverHTTP
  }
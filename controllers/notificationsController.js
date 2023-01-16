const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const functions = require('firebase-functions')


/* gmail  credentials */
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: 'haifatanazefti88@gmail.com',
      pass: 'mxddrzmekqzhndjc'
  }
});

const sendNotification = async (req, res, next) => {
    /*const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
      };*/
  try {
    await admin.messaging().sendMulticast({
        tokens: ["BBG8yFQpySQK9QRC8QDI98bVQerCwIw_sGD1Qj-vH0z_eB4KFYW3XhFq1OHRnYoyQ-BY8eWg6VoHEi2JpjyW6gM", 
        "ce-EpJ6y82kYbLyNJDe4eV:APA91bF2vGq9zRlaVQANitmorUNIZKsuD7nLor0tp8rkEAIncbaoRhEE9emh5eJ3LdNgsnPNHMuF3GgmFXBT88sL0cNW7ci5DR4wklt5hHBS46d-d29YJ65-1C2CIefwaM3dokpl-Gnd"],
        notification: {
          title: "heeey!!!!",
          body: "hello auzy",
          imageUrl: "https://www.shutterstock.com/image-vector/notification-icon-vector-material-design-260nw-759841507.jpg",
        },
        // options :  notification_options
    })
    res.status(200).json({ message: "notification send!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
    sendNotification,
    sendMailOverHTTP
  }
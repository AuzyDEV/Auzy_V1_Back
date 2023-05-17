const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
  const mailOptions = {
    from: options.from,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };
await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

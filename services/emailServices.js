const nodemailer = require('nodemailer');
const { MAIL_SETTINGS } = require('../config/mail');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

module.exports.sendMail = async (params) => {
  try {
    transporter.verify(function (error, success) {
      if (error) {
        console.log('====>' + error);
      } else if (success) {
        console.log("Server is ready to take our messages");
      }
    });

    const mailData = {
      from: MAIL_SETTINGS.auth.user,
      to: params.to, // list of receivers
      subject: 'Your Sentra Hotel OTP Code ✔', // Subject line
      text: "text",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome Sentra Hotel.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Please enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
        <p style="margin-top:50px;">If you do not request for verification please do not respond to the mail. You can in turn un subscribe to the mailing list and we will never bother you again.</p>
      </div>
    `,
    };

    const mailDataWithAttachment = {
      from: 'youremail@gmail.com',
      to: to,
      subject: subject,
      text: text,
      html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
      attachments: [
          {   // file on disk as an attachment
              filename: 'nodemailer.png',
              path: 'nodemailer.png'
          },
          {   // file on disk as an attachment
              filename: 'text_file.txt',
              path: 'text_file.txt'
          }
      ]
  };

    let info =  transporter.sendMail(mailData, (error, info) => {
      if (error) {
          return console.log(error);
      }
     console.log(info)
  });

    return info;
  } catch (error) {
    console.log(error);
    console.log(MAIL_SETTINGS.auth.user);
    console.log(MAIL_SETTINGS.auth.pass);
    console.log("TO:" + params.to);
    return false;
  }
};
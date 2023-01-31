const sgMail = require('@sendgrid/mail');
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (emailTo, name)=> {
    sgMail.send({
        to: emailTo,
        from: 'developer9212@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the New Bazaar, ${name}. Let me know how you get along with the app.`
    })
}


module.exports = {
    sendWelcomeEmail
}




// const sendWelcomeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'andrew@mead.io',
//         subject: 'Thanks for joining in!',
//         text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
//     })
// }
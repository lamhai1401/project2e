// // add nodemailer
const nodemailer = require('nodemailer');
const EMAIL_USER = require('../config/config').email_user;
const EMAIL_PASS = require('../config/config').email_pass;
// const EMAIL_USER = 'nodejsnodejs1'
// const EMAIL_PASS = 'nodejsnodejs'
// create transporter
const transporter = nodemailer.createTransport(`smtps://${EMAIL_USER}%40gmail.com:${EMAIL_PASS}@smtp.gmail.com`);

// function for confirm email
async function ConfirmEmail(receivers, code) {
    try {
        const mailOptions = {
            from: `"Confirm" <${EMAIL_USER}@gmail.com>`, // sender address
            to: receivers, // list of receivers
            subject: 'Please verify your email address', // Subject line
            text: 'Confirm Email', // plain text body
            html: `<b> ${code} </b>` // html body
        };
    
        const sendmail = await transporter.sendMail(mailOptions);
        return sendmail;
    } catch(err) {
        return err.message;
    }
};

// function for warning process system
async function WarningEmail(receivers, templates) {
    try {
        const mailOptions = {
            from: `"System" <${EMAIL_USER}@gmail.com>`, // sender address
            to: receivers, // list of receivers
            subject: 'Warning System', // Subject line
            text: 'Warning Email', // plain text body
            html: `${templates}` // html body
        };
        const sendmail = await transporter.sendMail(mailOptions);
        return sendmail;
    } catch(err) {
        return err.message;
    }
};

module.exports = {
    ConfirmEmail: ConfirmEmail,
    WarningEmail: WarningEmail
}
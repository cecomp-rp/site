const nodemailer    = require('nodemailer');
const addFields     = require('../other/addFields');
const User          = require('../../database/models/User');
const prettyPrint   = require('../other/prettyPrint');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify().then(() => {
    prettyPrint("Email", "Connected to Gmail.", "success");
}).catch((err) => {
    prettyPrint("Email", "Could not connect to Gmail.", "error");
});

async function sendMail (subject, to, content){

    //Add footer
    const content_footer = `
    <br><br>
    <p>Você pode desabilitar o recebimento de emails em: <p>
    <a href='https://cecomp.com.br/account'>cecomp.com.br/account</a>
    `;
    content = content + content_footer;

    //Try to find user
    const user = await User.findOne({email: to})
    .catch((error) => {})

    if(user){
        //Add fields to content
        content = addFields(content, {user});

        //Check if user has email notifications enabled
        if(!user.userSettings.enable_email_notifications_global){
            return false;
        }
    }

    //Send email
    transporter.sendMail({
        from: process.env.GMAIL_TITLE + " <" + process.env.GMAIL_USER + ">", 
        to, // list of receivers
        subject, // Subject line
        html: content, // html body
    }).then(info => {
        return true;
    }).catch(err => {
        prettyPrint("Email", "Could not send email.", "error");
        return false;
    });
   
}

module.exports = sendMail;








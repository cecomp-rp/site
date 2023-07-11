const nodemailer    = require('nodemailer');
const addFields     = require('../other/addFields');
const User          = require('../../database/models/User');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify().then(() => {
    console.log('Email: Connected to Gmail!');
}).catch((err) => {
    console.log('Email: Could not connect to Gmail! ' + err);
});

async function sendMail (subject, to, content){

    //Try to find user
    const user = await User.findOne({email: to})
    .catch((error) => {})

    if(user){
        //Add fields to content
        content = addFields(content, user);
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
        console.log(err);
        return false;
    });
        
}

module.exports = sendMail;








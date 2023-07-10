const express               = require("express")
const sendMail              = require("../../utils/mail/sendMail")
const commonRes             = require("../../utils/io/commonRes")

const router = new express.Router()

//GET contact
//In pages router

//POST contact (send email)
router.post("/api/contact", async (req, res) => {
    
    const data = req.body

    const subject   = "Contact - " + data.type;
    const to        = process.env.GMAIL_USER;
    const content   = "Email de retorno: " + data.email + "<br><br>" + data.content;

    const email = sendMail(subject, to, content)

    if(email){
        commonRes(res, {
            error: undefined,
            message: "Contact form was sent.",
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: "Could not send contact form.",
            message: undefined,
            content: undefined
        }); return;
    }

})

module.exports = router



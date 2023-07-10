const express               = require("express")
const logged                = require("../../middleware/logged")
const Subscription          = require("../../database/models/Subscription")
const User                  = require("../../database/models/User")
const sendMail              = require("../../utils/mail/sendMail")
const commonRes             = require("../../utils/io/commonRes")

const router = new express.Router()

//POST email (global)
router.post("/api/emails/global", logged(['admin']), async (req, res) => {
    
    const data = req.body;

    //Find all users
    const users = await User.find({})
    .catch((error) => {})

    if(!users){
        commonRes(res, {
            error: "No users found.",
            message: undefined,
            content: undefined
        }); return;
    }
    
    //For each user, send email
    users.forEach(async (user) => {

        //Send email
        sendMail(data.subject, user.email, data.content)

    })

    commonRes(res, {
        error: undefined,
        message: "Sent!",
        content: undefined
    }); return;

})

//POST email (event)
router.post("/api/emails/event/:id", logged(['admin']), async (req, res) => {
        
    const event_id = req.params.id;
    const data = req.body;

    //Find all subscriptions
    const subscriptions = await Subscription.find({event_id})
    .catch((error) => {})

    if(!subscriptions){
        commonRes(res, {
            error: "No subscriptions found.",
            message: undefined,
            content: undefined
        }); return;
    }

    //For each subscription with enable_email_notifications true, find user
    const users = await Promise.all(subscriptions.map(async (subscription) => {
        if(subscription.userSettings.enable_email_notifications){
            return await User.findById(subscription.user_id)
            .catch((error) => {})
        }
    }))

    //clear undefineds
    const users_filtered = users.filter((user) => {
        return user != undefined;
    })
            
    if(!users_filtered){
        commonRes(res, {
            error: "No users found.",
            message: undefined,
            content: undefined
        }); return;
    }

    //For each user, send email
    users_filtered.forEach(async (user) => {

        //Send email
        sendMail(data.subject, user.email, data.content)

    })

    commonRes(res, {
        error: undefined,
        message: "Sent!",
        content: undefined
    }); return;

})

module.exports = router


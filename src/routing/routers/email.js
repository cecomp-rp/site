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

    //Find all users userSettings.enable_email_notifications true
    const users = await User.find({ "userSettings.enable_email_notifications": true})
    .catch((error) => {})

    if(!users){
        commonRes(res, {
            error: "No users found.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Apply filters
    const filters = data.filters;
    if(filters.role == ''){ delete filters.role }

    const users_filtered = users.filter((user) => {
        var user_passed = true;
        
        //Roles
        if(filters.role){
           if(!user.roles.includes(filters.role)){ user_passed = false; }
        }

        return user_passed;
    })

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

    //Apply filters
    const filters = data.filters;
    if(filters.role == ''){ delete filters.role }

    const users_filtered_again = users_filtered.filter((user) => {
        var user_passed = true;
        
        //Roles
        if(filters.role){
           if(!user.roles.includes(filters.role)){ user_passed = false; }
        }

        return user_passed;
    })

    //For each user, send email
    users_filtered_again.forEach(async (user) => {

        //Send email
        sendMail(data.subject, user.email, data.content)

    })

    commonRes(res, {
        error: undefined,
        message: "Sent!",
        content: undefined
    }); return;

})

//POST email (activity)
router.post("/api/emails/actv/:id", logged(['admin']), async (req, res) => {

    const activity_id = req.params.id;
    const data = req.body;

    //Find all users by activity_id
    const subscriptions = await Subscription.find({ "activities_done.activity_id": activity_id })
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

    //Apply filters
    const filters = data.filters;
    if(filters.role == ''){ delete filters.role }

    const users_filtered_again = users_filtered.filter((user) => {
        var user_passed = true;
        
        //Roles
        if(filters.role){
           if(!user.roles.includes(filters.role)){ user_passed = false; }
        }

        return user_passed;
    })

    //For each user, send email
    users_filtered_again.forEach(async (user) => {

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


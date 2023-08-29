const express                                               = require("express")
const logged                                                = require("../../middleware/logged")
const { createEventCertificate }                            = require("../../utils/certificate/eventCertificate")
const Subscription                                          = require("../../database/models/Subscription")
const Event                                                 = require("../../database/models/Event")
const commonRes                                             = require("../../utils/io/commonRes")
const filterObject                                          = require("../../utils/other/filterObject")
const sendMail                                              = require("../../utils/mail/sendMail")
const addFields                                             = require("../../utils/other/addFields")
const cookieWarning                                         = require("../../utils/io/cookieWarning")

const router = new express.Router()


//EVENT SUBSCRIPTIONS

//GET events (subscribe)
router.get("/sub/:event_name", logged(['basic_functions']), async (req, res) => {
    
    try{

        const event_name = req.params.event_name;

        //Does event exist?
        const event = await Event.findOne({name: event_name})
        .catch((err) => {})

        if(!event) {
            res.redirect("/events");
            return;
        }

        //Is event over?
        if(event.endDate < Date.now()){
            res.redirect("/events/" + event.name);
            return;
        }
        
        //Is user already subscribed?
        const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})

        if(alreadySub){
            res.redirect("/events/" + event_name);
            return;
        }

        //User has permission to subscribe?
        if(event.roleRestriction != null){
            if(!req.user.roles.includes(event.roleRestriction)){
                cookieWarning(res, "noPermissionEvent");
                res.redirect("/events/" + event_name);
                return;
            }
        }

        //Set user settings
        const userSettings = {
            enable_email_notifications: req.user.userSettings.enable_email_notifications_global,
            enable_email_sharing: req.user.userSettings.enable_email_sharing_global
        }

        //Create subscription
        const sub = await Subscription.create({user_id: req.user._id, event_id: event._id, userSettings})
        .catch((err) => {})

        if(!sub){
            res.redirect("/events/" + event_name);
            return;
        }

        //Create CERTIFICATE
        createEventCertificate(req.user._id, event._id);

        //Verify if the user has email notifications enabled in sub
        if(!sub.userSettings.enable_email_notifications){
            res.redirect("/events/" + event_name);
            return;
        }

        //Verify if the event has an email for event_subscribe
        const email = event.emails.find((email) => {
            return email.type == "event_subscribe"
        })

        if(email){
            //Add fields to content
            email.content = addFields(email.content, {user: req.user, event: event});

            //Send email
            sendMail("Inscrição no evento: " + event.name, req.user.email, email.content);
        }
        
        res.redirect("/events/" + event_name);

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }
   
})

//GET events (unsubscribe)
router.get("/unsub/:event_name", logged(['basic_functions']), async (req, res) => {
    
    try{

        const event_name = req.params.event_name;

        //Does event exist?
        const event = await Event.findOne({name: event_name})
        .catch((err) => {})
        if(!event){
            res.redirect("/events");
            return;
        }

        //Is event over?
        if(event.endDate < Date.now()){
            res.redirect("/events/" + event.name);
            return;
        }
        
        //Is user already subscribed?
        const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})
        if(!alreadySub){
            res.redirect("/events/" + event_name);
            return;
        }
        
        //Delete subscription
        const sub = await Subscription.deleteOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})

        if(!sub){
            res.redirect("/events");
            return;
        }

        //Verify if the user has email notifications enabled in sub
        if(!alreadySub.userSettings.enable_email_notifications){
            res.redirect("/events/" + event_name);
            return;
        }

        //Verify if the event has an email for event_unsubscribe
        const email = event.emails.find((email) => {
            return email.type == "event_unsubscribe"
        })

        if(email){
            //Add fields to content
            email.content = addFields(email.content, {user: req.user, event: event});

            //Send email
            sendMail("Desinscrição no evento: " + event.name, req.user.email, email.content);
        }
        
        res.redirect("/events/" + event_name);

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//POST events (verify subscription)
router.post("/api/sub/verify/:event_name", logged(['basic_functions']), async (req, res) => {
    
    try{

        const event_name = req.params.event_name;

        //Get event id
        const event = await Event.findOne({name: event_name})
        .catch((err) => {})
        
        if(!event){
            commonRes(res, {
                error: "Event not found.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Is user already subscribed?
        const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})

        if(alreadySub){
            commonRes(res, {
                error: undefined,
                message: undefined,
                content: {subscribed: true}
            }); return;
        }else{
            commonRes(res, {
                error: undefined,
                message: undefined,
                content: {subscribed: false}
            }); return;
        }

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//POST events (get preferences)
router.post("/api/sub/preferences/:event_name", logged(['basic_functions']), async (req, res) => {

    try{

        const event_name = req.params.event_name;

        //Does event exist?
        const event = await Event.findOne({name: event_name})
        .catch((err) => {})

        if(!event){
            commonRes(res, {
                error: "Event not found.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Is user already subscribed?
        const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})

        if(!alreadySub){
            commonRes(res, {
                error: "User not subscribed.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Return preferences
        const content = filterObject(
            alreadySub.userSettings, //object
            ['enable_email_notifications', 'enable_email_sharing'], //allow keys
            {} //rename
        )

        commonRes(res, {
            error: undefined,
            message: undefined,
            content: content
        }); return;

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//PATCH events (set preferences)
router.patch("/api/sub/preferences/:event_name", logged(['basic_functions']), async (req, res) => {

    try{

        const event_name = req.params.event_name;
        const preferences = req.body;

        //Does event exist?
        const event = await Event.findOne({name: event_name})
        .catch((err) => {})

        if(!event){
            commonRes(res, {
                error: "Event not found.",
                message: undefined,
                content: undefined
            }); return;
        }
        
        //Is user already subscribed?
        const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})
        
        if(!alreadySub){
            commonRes(res, {
                error: "User not subscribed.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Update preferences
        alreadySub.userSettings = preferences

        const preferencesDb = await Subscription.updateOne({user_id: req.user._id, event_id: event._id}, alreadySub, {runValidators: true})
        .catch((err) => {})

        if(!preferencesDb){
            commonRes(res, {
                error: "Error updating preferences.",
                message: undefined,
                content: undefined
            }); return;
        }else{
            commonRes(res, {
                error: undefined,
                message: "Preferences updated.",
                content: undefined
            }); return;
        }

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//ACTIVITIES SUBSCRIPTIONS

//GET activities (subscribe)
router.get("/actv/:actv_id", logged(['basic_functions']), async (req, res) => {
    
    try{

        const actv_id = req.params.actv_id;

        //Find event
        //An event has an array of activities, each activity has a unique id
        const event = await Event.findOne({activities: {$elemMatch: {_id: actv_id}}})
        .catch((err) => {})
        
        if(!event){
            res.redirect("/events");
            return;
        }

        //Is event over or not started?
        if((event.endDate < Date.now()) || (event.startDate > Date.now())){
            res.redirect("/events/" + event.name);
            return;
        }

        //Is user already subscribed?
        const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})

        if(!alreadySub) {
            cookieWarning(res, "notSubscribed");
            res.redirect("/events/" + event.name);
            return;
        }

        //Is activity already done?
        const alreadyDone = alreadySub.activities_done.find((actv) => {
            return actv.activity_id == actv_id
        })

        if(alreadyDone) {
            res.redirect("/events/" + event.name);
            return;
        }
        
        //Add activity to user subscription
        alreadySub.activities_done.push({activity_id: actv_id})
        const sub = await Subscription.updateOne({user_id: req.user._id, event_id: event._id}, alreadySub, {runValidators: true})
        .catch((err) => {})

        if(!sub){
            res.redirect("/events");
            return;
        }

        cookieWarning(res, "activityAdded");

        //Verify if the user has email notifications enabled in sub
        if(!alreadySub.userSettings.enable_email_notifications){
            res.redirect("/events/" + event.name);
            return;
        }

        //Verify if the event has an email for atv_subscribe
        const email = event.emails.find((email) => {
            return email.type == "atv_subscribe"
        })

        if(email){

            //Get activity title
            const actv = event.activities.find((actv) => {
                return actv._id == actv_id
            })

            //Add fields to content
            email.content = addFields(email.content, {user: req.user, event: event});

            //Send email
            sendMail("Inscrição na atividade: " + actv.title, req.user.email, email.content);
        }

        res.redirect("/events/" + event.name);

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//GET activities (just names, unique for user, list by event)
router.get("/api/actv/:event_name", logged(['basic_functions']), async (req, res) => {

    try{

        const event_name = req.params.event_name;

        //Get event
        const event = await Event.findOne({name: event_name})
        .catch((err) => {})

        if(!event){
            commonRes(res, {
                error: "Event not found.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Get subscription
        const subs = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
        .catch((err) => {})

        if(!subs){
            commonRes(res, {
                error: "User not subscribed.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Get activity ids done by user
        const actv_ids = subs.activities_done.map((actv) => {
            return actv.activity_id
        })

        //Get desc and titles from event.activities, using actv_ids
        const actvs_done = event.activities.filter((actv) => {
            return actv_ids.includes(actv._id.toString())
        }).map((actv) => {
            return {title: actv.title, description: actv.description}
        })
        
        //filter
        const content = filterObject(
            actvs_done, //object
            ['title', 'description'], //allow keys
            {} //rename
        )

        commonRes(res, {
            error: undefined,
            message: undefined,
            content: content
        }); return;

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//GET events (just names, unique for user, list by event)
router.get("/api/sub/", logged(['basic_functions']), async (req, res) => {

    try{

        //Get subscriptions
        const subs = await Subscription.find({user_id: req.user._id})
        .catch((err) => {})

        if(!subs){
            commonRes(res, {
                error: "User not subscribed.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Get event ids
        const event_ids = subs.map((sub) => {
            return sub.event_id
        })

        //Get event title, name and descriptions
        const event_info = await Event.find({_id: {$in: event_ids}}).select("title name description")
        .catch((err) => {})

        if(!event_info){
            commonRes(res, {
                error: "Error getting event info.",
                message: undefined,
                content: undefined
            }); return;
        }
        
        //filter
        const content = filterObject(
            event_info, //object
            ['title', 'name', 'description'], //allow keys
            {} //rename
        );

        commonRes(res, {
            error: undefined,
            message: undefined,
            content: content
        }); return;

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})




module.exports = router
const urlSlug                   = require("url-slug")
const express                   = require("express")
const logged                    = require("../../middleware/logged")
const Event                     = require("../../database/models/Event")
const Subscription              = require("../../database/models/Subscription")
const commonRes                 = require("../../utils/io/commonRes")
const filterObject              = require("../../utils/other/filterObject")
const addFields                 = require("../../utils/other/addFields")
const sendMail                  = require("../../utils/mail/sendMail")

const router = new express.Router()

//GET events (page)
//In pages router

//GET events (unique by id)
//In pages router

//EVENTS/ACTIVITIES MANAGEMENT

//GET events (list by page)
router.get("/api/events/by_page/:page", logged(['basic_functions']), async (req, res) => {

    const page_limit = 5;
    const page = req.params.page;

    var events = await Event.find({})
    .sort({created_at: -1})
    .skip((page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .catch((error) => {})

    if(!events){
        commonRes(res, {
            error: "No events found.",
            message: undefined,
            content: []
        }); return;
    }

    //If user is not admin, remove activities
    if(!req.user.admin){
        events = filterObject(
            events, //object
            ['name', 'title', 'startDate', 'endDate', 'roleRestriction', 'description', 'created_at', 'updated_at', '_id'], //allowed atributes
            {} //rename atributes
        );
    }

    const content = filterObject(
        events, //object
        ['name', 'title', 'startDate', 'endDate', 'roleRestriction', 'activities', 'description', 'created_at', 'updated_at', '_id', 'emails', 'certificate'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;

})

//GET events (unique by id)
router.get("/api/events/by_id/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id

    const event = await Event.findOne({_id: id})
    .catch((error) => {})

    if(!event){

        commonRes(res, {
            error: "No event found.",
            message: undefined,
            content: {}
        }); return;
    
    }else{

        const content = filterObject(
            event, //object
            ['name', 'title', 'startDate', 'endDate', 'roleRestriction', 'activities', 'description', 'created_at', 'updated_at', '_id', 'emails', 'certificate'], //allowed atributes
            {} //rename atributes
        );

        commonRes(res, {
            error: undefined,
            message: "Success.",
            content
        }); return;

    }

})

//GET events (unique by name)
router.get("/api/events/by_name/:name", logged(['basic_functions']), async (req, res) => {

    const name = req.params.name

    var event = await Event.findOne({name: name})
    .lean()
    .catch((error) => {})

    if(!event){
        commonRes(res, {
            error: "No event found.",
            message: undefined,
            content: {}
        }); return;
    }

    //If user is not admin, remove activities ids
    if(!req.user.admin){
        event = filterObject(
            event, //object
            ['name', 'title', 'startDate', 'endDate', 'roleRestriction', 'description', 'created_at', 'updated_at', '_id'], //allowed atributes
            {} //rename atributes
        );
    }

    const content = filterObject(
        event, //object
        ['name', 'title', 'startDate', 'endDate', 'roleRestriction', 'activities', 'description', 'created_at', 'updated_at', '_id'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;

})

//POST events (create)
router.post("/api/events", logged(['admin']), async (req, res) => {

    const event = req.body

    //Copy name to title
    event.title = event.name

    //Normalize name
    event.name = urlSlug(event.name, {
        separator: "-",
        camelCase: false
    })

    //Name is unique
    const unique_name = await Event.findOne({name: event.name})
    if(unique_name){
        commonRes(res, {
            error: "Name already in use.",
            message: undefined,
            content: {}
        }); return;
    }

    //Verify event dates
    if(event.startDate > event.endDate){
        commonRes(res, {
            error: "Invalid dates.",
            message: undefined,
            content: {}
        }); return;
    }

    //Verify activities dates
    var invalid_activities = false;
    event.activities.forEach((activity) => {
        
        //Activity - Event 
        var atv_endDate = activity.startDate + activity.duration * 60 * 60 * 1000; //Duration is in hours
        if( (atv_endDate > event.endDate) || (activity.startDate < event.startDate) ){
            invalid_activities = true;
        }

    })

    if(invalid_activities){
        commonRes(res, {
            error: "Invalid activities dates.",
            message: undefined,
            content: {}
        }); return;
    }

    //Create
    const eventDb = await Event.create(event)
    .catch((error) => {})

    if(!eventDb){
        commonRes(res, {
            error: "Error creating event.",
            message: undefined,
            content: {}
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: {}
        }); return;
    }

})

//PATCH events (update)
router.patch("/api/events/:id", logged(['admin']), async (req, res) => {

    var event = req.body
    const id = req.params.id

    //Copy name to title
    event.title = event.name

    //Normalize name
    event.name = urlSlug(event.name, {
        separator: "-",
        camelCase: false
    })

    //If, there's a new name: Name is unique?
    const new_name = event.name;
    const old_event = await Event.findOne({_id: id})
    .catch((error) => {})

    if(!old_event){
        commonRes(res, {
            error: "Event not found.",
            message: undefined,
            content: {}
        }); return;
    }

    if(new_name != old_event.name){
        const unique_name = await Event.findOne({name: event.name})
        .catch((error) => {})

        if(unique_name){
            commonRes(res, {
                error: "Name already in use.",
                message: undefined,
                content: {}
            }); return;
        }
    }

    //IF _id is '' in activities, remove it
    event.activities.forEach((activity) => {
        if(activity._id == ''){activity._id = undefined}
    })
        
    //Verify event dates
    if(event.startDate > event.endDate){
        commonRes(res, {
            error: "Invalid dates.",
            message: undefined,
            content: {} 
        }); return;
    }

    //Verify activities dates
    var invalid_activities = false;
    event.activities.forEach((activity) => {
        
        //Activity - Event 
        var atv_endDate = activity.startDate + activity.duration * 60 * 60 * 1000; //Duration is in hours
        if( (atv_endDate > event.endDate) || (activity.startDate < event.startDate) ){
            invalid_activities = true;
        }

    })

    if(invalid_activities){
        commonRes(res, {
            error: "Invalid activities dates.",
            message: undefined,
            content: {}
        }); return;
    }

    //Update the rest
    const eventDb = await Event.findOneAndUpdate({_id: id}, event, {runValidators: true})
    .catch((error) => {})

    if(!eventDb){
        commonRes(res, {
            error: "Error updating event.",
            message: undefined,
            content: {}
        }); return;
    }

    //Verify if this event has has an email for event_update
    const email = event.emails.find((email) => {
        return email.type == "event_update"
    })

    if(!email){
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: {}
        }); return;
    }

    //Get all users subscribed to this event with email notifications enabled
    const subscriptions = await Subscription.find({event_id: id, "userSettings.enable_email_notifications": true})
    .catch((error) => {})

    if(!subscriptions){
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: {}
        }); return;
    }

    //Send email to all users
    subscriptions.forEach((subscription) => {

        //Add fields to content
        email.content = addFields(email.content, {user: req.user, event: event});

        //Send email to all users subscribed to this event
        sendMail("Atualização no evento: " + new_name, req.user.email, email.content);
    
    })

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content: {}
    }); return;
    
})

//DELETE events (delete)
router.delete("/api/events/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id

    const event = await Event.findOneAndDelete({_id: id})
    .catch((error) => {})

    if(!event){
        commonRes(res, {
            error: "Error deleting event.",
            message: undefined,
            content: {}
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: {}
        }); return;
    }

})

//GET activity (unique by id)
router.get("/api/actv/by_id/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id;

    //Find event with activity id
    const event = await Event.findOne({"activities._id": id})
    .catch((error) => {})

    if(!event){
        commonRes(res, {
            error: "No activity found.",
            message: undefined,
            content: {}
        }); return;
    }

    //Filter activity with filterObject
    const activity = filterObject(
        event.activities.id(id), //object
        ['title', 'description', 'startDate', 'duration', '_id'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content: activity
    }); return;
    
});


module.exports = router
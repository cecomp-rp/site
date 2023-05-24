const express               = require("express")
const logged                = require("../../middleware/logged")
const Subscription          = require("../../database/models/Subscription")
const User                  = require("../../database/models/User")
const Event                 = require("../../database/models/Event")
const cookieSession = require("cookie-session")

const router = new express.Router()


//EVENT SUBSCRIPTIONS

//GET events (subscribe)
router.get("/sub/:event_name", logged(['basic_functions']), async (req, res) => {
    
    //Does event exist?
    const event = await Event.findOne({name: req.params.event_name})
    if(!event) return res.redirect("/events");

    //Is event over?
    if(event.endDate < Date.now()) return res.redirect("/events/" + event.name);

    //Is user already subscribed?
    const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
    if(alreadySub) return res.redirect("/events/" + req.params.event_name);

    //Create subscription
    Subscription.create({
        user_id: req.user._id,
        event_id: event._id
    }).then((sub) => {
        res.redirect("/events/" + req.params.event_name);
    }).catch((err) => {
        console.log(err);
        res.redirect("/events");
    })

})

//GET events (unsubscribe)
router.get("/unsub/:event_name", logged(['basic_functions']), async (req, res) => {
    
    //Does event exist?
    const event = await Event.findOne({name: req.params.event_name})
    if(!event) return res.redirect("/events");

    //Is event over?
    if(event.endDate < Date.now()) return res.redirect("/events/" + event.name);

    //Is user already subscribed?
    const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
    if(!alreadySub) return res.redirect("/events/" + req.params.event_name);

    //Delete subscription
    Subscription.deleteOne({
        user_id: req.user._id,
        event_id: event._id
    }).then((sub) => {
        res.redirect("/events/" + req.params.event_name);
    }).catch((err) => {
        console.log(err);
        res.redirect("/events");
    })

})

//POST events (verify subscription)
router.post("/api/sub/verify/:event_name", logged(['basic_functions']), async (req, res) => {
    
    //Get event id
    const event = await Event.findOne({name: req.params.event_name})
    if(!event) return res.status(404).json({error: "Event not found."});

    //Is user already subscribed?
    const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
    if(alreadySub) return res.status(200).json({subscribed: true});

    return res.status(200).json({subscribed: false});
})

//POST events (get preferences)
router.post("/api/sub/preferences/:event_name", logged(['basic_functions']), async (req, res) => {

    //Does event exist?
    const event = await Event.findOne({name: req.params.event_name})
    if(!event) return res.status(404).json({error: "Event not found."});

    //Is user already subscribed?
    const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
    if(!alreadySub) return res.status(404).json({error: "User not subscribed."});

    //Return preferences
    return res.status(200).json({preferences: alreadySub.userSettings});

})

//PATCH events (set preferences)
router.patch("/api/sub/preferences/:event_name", logged(['basic_functions']), async (req, res) => {

    //Does event exist?
    const event = await Event.findOne({name: req.params.event_name})
    if(!event) return res.status(404).json({error: "Event not found."});

    //Is user already subscribed?
    const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
    if(!alreadySub) return res.status(404).json({error: "User not subscribed."});

    //Update preferences
    alreadySub.userSettings = req.body.preferences

    Subscription.updateOne({user_id: req.user._id, event_id: event._id}, alreadySub, {runValidators: true})
    .then((sub) => {
        return res.status(200).send();
    }).catch((err) => {
        console.log(err);
        return res.status(400).send();
    })

})

//ACTIVITIES SUBSCRIPTIONS

//GET activities (subscribe)
router.get("/actv/:actv_id", logged(['basic_functions']), async (req, res) => {
    
    //Find event
    //An event has an array of activities, each activity has a unique id
    const event = await Event.findOne({activities: {$elemMatch: {_id: req.params.actv_id}}})
    .then((event) => { 
        return event;
    }).catch((err) => {
        console.log(err);
    })
    if(!event){return res.redirect("/events");}

    //Is event over?
    if(event.endDate < Date.now()) return res.redirect("/events/" + event.name);

    //Is user already subscribed?
    const alreadySub = await Subscription.findOne({user_id: req.user._id, event_id: event._id})
    if(!alreadySub) return res.redirect("/events/" + event.name);

    //Is activity already done?
    const alreadyDone = alreadySub.activities_done.find((actv) => {
        return actv.activity_id == req.params.actv_id
    })
    if(alreadyDone) return res.redirect("/events/" + event.name);

    //Add activity to user subscription
    alreadySub.activities_done.push({activity_id: req.params.actv_id})
    Subscription.updateOne({user_id: req.user._id, event_id: event._id}, alreadySub, {runValidators: true})
    .then((sub) => {

        //Redirect to event
        return res.redirect("/events/" + event.name);

    }).catch((err) => {

        console.log(err);
        return res.redirect("/events");

    })

})

//GET activities (just names, unique for user, list by event)
router.get("/api/actv/:event_name", logged(['basic_functions']), async (req, res) => {

    //Get event
    const event = await Event.findOne({name: req.params.event_name})

    //Get subscription
    const subs = await Subscription.findOne({user_id: req.user._id, event_id: event._id})

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
    
    //Return
    return res.status(200).json(actvs_done)

})

//GET events (just names, unique for user, list by event)
router.get("/api/sub/", logged(['basic_functions']), async (req, res) => {

    //Get subscriptions
    const subs = await Subscription.find({user_id: req.user._id})
    if(!subs){return res.status(400).send()}

    //Get event ids
    const event_ids = subs.map((sub) => {
        return sub.event_id
    })

    //Get event title, name and descriptions
    const event_info = await Event.find({_id: {$in: event_ids}}).select("title name description")

    //Return
    return res.status(200).json(event_info)

})




module.exports = router
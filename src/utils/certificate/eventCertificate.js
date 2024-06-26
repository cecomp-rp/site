const Event         = require("../../database/models/Event");
const Subscription  = require("../../database/models/Subscription");
const User          = require("../../database/models/User");
const Certificate   = require("../../database/models/Certificate");
const addFields     = require("../other/addFields");

async function createEventCertificate(user_id, event_id){

    //Test if user is certificate already exists
    const cert = await Certificate.findOne({owner_id: user_id, event_id: event_id});
    if(cert){return;}

    const user = await User.findById(user_id);
    const event = await Event.findById(event_id);
    const sub = await Subscription.findOne({user_id: user_id, event_id: event_id});

    //Check if user is subscribed to event
    if(!sub){return;}

    //Check if event was found
    if(!event){return;}

    //Check if event has certificate template
    if(!event.certificate){return;}

    //Activities user did
    var activities = [];
    await sub.activities_done.forEach((activity) => {
        activities.push(event.activities.id(activity.activity_id));
    })

    //Add fields to certificate
    var certificate_content = addFields(event.certificate, {user, event, activities});
    
    //Create certificate and save it
    const new_cert =  await Certificate.create({
        owner_id: user_id,
        event_id: event_id,
        is_event_certificate: true,
        title: event.title,
        content: certificate_content
    });

    //Add event name
    var cert_lean = new_cert.toObject();
    cert_lean.event_name = event.name;

    return cert_lean;
}

async function updateEventCertificate(user_id, event_id){

    //Check if certificate exists
    const cert = await Certificate.findOne({owner_id: user_id, event_id: event_id});
    if(!cert){return;}

    const user = await User.findById(user_id);
    const event = await Event.findById(event_id);
    const sub = await Subscription.findOne({user_id: user_id, event_id: event_id});

    //Check if user is subscribed to event
    if(!sub){return cert;}

    //Check if event was found
    if(!event){return cert;}

    //Check if event has certificate template
    if(!event.certificate){return cert;}

    //Activities user did
    var activities = [];
    await sub.activities_done.forEach((activity) => {
        activities.push(event.activities.id(activity.activity_id));
    })

    //Add fields to certificate
    var certificate_content = addFields(event.certificate, {user, event, activities});
    
    //Update certificate
    cert.content = certificate_content;
    await cert.save();

    //Add event name
    var cert_lean = cert.toObject();
    cert_lean.event_name = event.name;

    return cert_lean;
}

module.exports = { createEventCertificate, updateEventCertificate };
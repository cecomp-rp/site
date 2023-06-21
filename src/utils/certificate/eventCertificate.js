const Event         = require("../../database/models/Event");
const Subscription  = require("../../database/models/Subscription");
const User          = require("../../database/models/User");
const Certificate   = require("../../database/models/Certificate");

async function createEventCertificate(user_id, event_id){

    //Test if user is certificate already exists
    const cert = await Certificate.findOne({owner_id: user_id, event_id: event_id});
    if(cert){return;}

    const user = await User.findById(user_id);
    const event = await Event.findById(event_id);
    const sub = await Subscription.findOne({user_id: user_id, event_id: event_id});

    //Activities user did
    var activities = [];
    await sub.activities_done.forEach((activity) => {
        activities.push(event.activities.id(activity.activity_id));
    })

    //Total hours
    var totalHours = 0;
    await activities.forEach((activity) => {
        totalHours += activity.duration;
    })

    var certificate_content = `
    <h2>${user.name} participou do evento ${event.name} perfazendo um total de ${totalHours} horas.</h2>

    <h3>${event.title}</h3>
    <h3>${event.description}</h3>
    <h3>${event.startDate} - ${event.endDate}</h3>

    <h3>As atividades realizadas pelo usuário foram:</h3>
    `;

    await activities.forEach((activity) => {

        var activities_content = `
        <h3>${activity.title}</h3>
        <h3>${activity.description}</h3>
        <h3>${activity.date}</h3>
        <h3>${activity.duration}</h3>
        `;

        certificate_content += activities_content;

    });

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

    //Activities user did
    var activities = [];
    await sub.activities_done.forEach((activity) => {
        activities.push(event.activities.id(activity.activity_id));
    })

    //Total hours
    var totalHours = 0;
    await activities.forEach((activity) => {
        totalHours += activity.duration;
    })

    var certificate_content = `
    <h2>${user.name} participou do evento ${event.name} perfazendo um total de ${totalHours} horas.</h2>

    <h3>${event.title}</h3>
    <h3>${event.description}</h3>
    <h3>${event.startDate} - ${event.endDate}</h3>

    <h3>As atividades realizadas pelo usuário foram:</h3>
    `;

    await activities.forEach((activity) => {

        var activities_content = `
        <h3>${activity.title}</h3>
        <h3>${activity.description}</h3>
        <h3>${activity.date}</h3>
        <h3>${activity.duration}</h3>
        `;

        certificate_content += activities_content;

    });

    //Update certificate
    cert.content = certificate_content;
    await cert.save();

    //Add event name
    var cert_lean = cert.toObject();
    cert_lean.event_name = event.name;

    return cert_lean;
}

module.exports = { createEventCertificate, updateEventCertificate };
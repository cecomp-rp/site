const urlSlug                   = require("url-slug")
const express                   = require("express")
const logged                    = require("../../middleware/logged")
const Event                     = require("../../database/models/Event")
const { acceleratedmobilepageurl } = require("googleapis/build/src/apis/acceleratedmobilepageurl")
const e = require("express")

const router = new express.Router()

//GET events (page)
//In pages router

//GET events (unique by id)
//In pages router

//EVENTS/ACTIVITIES MANAGEMENT

//GET events (list by page)
router.get("/api/events/by_page/:page", logged(['basic_functions']), (req, res) => {

    const page_limit = 5;

    Event.find({})
    .sort({createdAt: -1})
    .skip((req.params.page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .then((events) => {

        //If user is not admin, remove activities
        if(!req.user.admin){
            events.forEach((event) => {
                event.activities = []
            })
        }
        
        res.status(200).json(events)

    }).catch((error) => {

        console.log(error)
        res.status(400).send()
        return;

    })

})

//GET events (unique by id)
router.get("/api/events/by_id/:id", logged(['admin']), (req, res) => {

    Event.findOne({_id: req.params.id})
    .then((event) => {
            
        res.status(200).json(event)
    
    }).catch((error) => {

        console.log(error);
        res.status(400).send();
        return;

    })

})

//GET events (unique by name)
router.get("/api/events/by_name/:name", logged(['basic_functions']), (req, res) => {

    Event.findOne({name: req.params.name})
    .lean()
    .then((event) => {

        //If user is not admin, remove activities ids
        if(!req.user.admin){
            event.activities.forEach((activity) => {
                activity._id = '';
            })
        }

        res.status(200).json(event)

    }).catch((error) => {

        console.log(error);
        res.status(400).send();
        return;

    })

})

//POST events (create)
router.post("/api/events", logged(['admin']), async (req, res) => {

    //Copy name to title
    req.body.title = req.body.name

    //Normalize name
    req.body.name = urlSlug(req.body.name, {
        separator: "-",
        camelCase: false
    })

    //Name is unique
    const unique_name = await Event.findOne({name: req.body.name})
    if(unique_name){res.status(400).send(); return;}

    //Verify dates
    if(req.body.startDate > req.body.endDate){res.status(400).send()}

    Event.create(req.body)
    .then((event) => {
        
        res.status(201).send()

    }).catch((error) => {

        res.status(400).send();
        console.log(error);
        return;

    })

})

//PATCH events (update)
router.patch("/api/events/:id", logged(['admin']), async (req, res) => {

    //Copy name to title
    req.body.title = req.body.name

    //Normalize name
    req.body.name = urlSlug(req.body.name, {
        separator: "-",
        camelCase: false
    })

    //If, there's a new name: Name is unique?
    const new_name = req.body.name;
    const old_event = await Event.findOne({_id: req.params.id});
    if(new_name != old_event.name){
        const unique_name = await Event.findOne({name: req.body.name})
        if(unique_name){res.status(400).send(); return;}
    }

    //IF _id is '' in activities, remove it
    req.body.activities.forEach((activity) => {
        if(activity._id == ''){activity._id = undefined}
    })
        
    //Verify dates
    if(req.body.startDate > req.body.endDate){res.status(400).send(); return;}

    //Update the rest
    Event.findOneAndUpdate({_id: req.params.id}, req.body, {runValidators: true})
    .then((event) => {

        res.status(200).send()

    }).catch((error) => {

        res.status(400).send();
        console.log(error);
        return;

    })

})

//DELETE events (delete)
router.delete("/api/events/:id", logged(['admin']), async (req, res) => {

    Event.findOneAndDelete({_id: req.params.id})
    .then((event) => {
            
        res.status(200).send()
    
    }).catch((error) => {

        console.log(error)
        res.status(400).send();
        return;

    })

})


module.exports = router
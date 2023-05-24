const express               = require("express")
const logged                = require("../../middleware/logged")
const Subscription          = require("../../database/models/Subscription")
const User                  = require("../../database/models/User")

const router = new express.Router()


//EVENT SUBSCRIPTIONS

//GET events (subscribe)
router.get("/sub/:event_name", logged(['basic_functions']), async (req, res) => {
    res.send("subscribe")
})

//GET events (unsubscribe)
router.get("/unsub/:event_name", logged(['basic_functions']), async (req, res) => {
    res.send("subscribe")
})

//POST events (verify subscription)
router.post("/api/sub/verify/:event_id", logged(['basic_functions']), async (req, res) => {
    res.send("subscribe")
})


//ACTIVITIES SUBSCRIPTIONS

//GET activities (subscribe)
router.get("/actv/:actv_id", logged(['basic_functions']), async (req, res) => {
    res.send("subscribe")
})

//POST activities (verify subscription)
router.post("/api/actv/verify/:actv_id", logged(['basic_functions']), async (req, res) => {
    res.send("subscribe")
})







module.exports = router
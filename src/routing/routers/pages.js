const express               = require("express")
const not_logged            = require("../../middleware/not_logged")
const logged                = require("../../middleware/logged")

const router = new express.Router()

//ALL MEMBERS ----------------------------

//Index Page
router.get("/", (req, res) => {
    res.render("index")
})

//Semcomp Page
router.get("/semcomp", (req, res) => {
    res.render("semcomp")
})

//News Page
router.get("/news/:id", (req, res) => {
    res.render("news")
})

//Login Page
router.get("/login", not_logged, (req, res) => {
    res.render("login")
});

//Account Page
router.get("/account", logged(['basic_functions']), (req, res) => {
    res.render("account")
});

//Events Page
router.get("/events", logged(['basic_functions']), (req, res) => {
    res.render("events")
});

//Events Page - Unique Event
router.get("/events/:id", logged(['basic_functions']), (req, res) => {
    res.render("event")
});

//BCC MEMBERS ----------------------------

//Polls Page
router.get("/polls", logged(['bcc_member_functions']), (req, res) => {
    res.render("polls")
});

//Polls Page - Unique Poll
router.get("/polls/:id", logged(['bcc_member_functions']), (req, res) => {
    res.render("poll")
});

//Transparency Page
router.get("/transparency", logged(['bcc_member_functions']), (req, res) => {
    res.render("transparency")
});

//ADMIN ----------------------------------

//Console Page
router.get("/console", logged(['admin']), (req, res) => {
    res.render("console")
});


module.exports = router
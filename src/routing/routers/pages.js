const express               = require("express")
const not_logged            = require("../../middleware/not_logged")
const logged                = require("../../middleware/logged")

const router = new express.Router()

//ALL MEMBERS  - NOT LOGGED ----------------------------

//Index Page
router.get("/", (req, res) => {
    res.render("index")
})

//News Page
router.get("/news/:id", (req, res) => {
    res.render("news")
})

//Login Page
router.get("/login", not_logged, (req, res) => {
    res.render("login")
});

//Calendar Page
router.get("/calendar", (req, res) => {
    res.render("calendar")
});

//About us Page
router.get("/about", (req, res) => {
    res.render("about")
});

//Contact Page
router.get("/contact", (req, res) => {
    res.render("contact")
});

//Store Page
router.get("/store", (req, res) => {
    res.render("store")
});

//Suxto Page
router.get("/suxto", (req, res) => {
    res.render("suxto")
});

//ALL MEMBERS - LOGGED ----------------------------

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

//Certificates Page
router.get("/certificates", logged(['basic_functions']), (req, res) => {
    res.render("certificates")
})

//Certificates Page - Unique Certificate
router.get("/certificates/:id", (req, res) => {
    res.render("certificate")
})

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

//Internships Page
router.get("/internships", logged(['bcc_member_functions']), (req, res) => {
    res.render("internships")
});

//ADMIN ----------------------------------

//Console Page
router.get("/console", logged(['admin']), (req, res) => {
    res.render("console")
});

//Console (certificates) Page
router.get("/console/certificates", logged(['admin']), (req, res) => {
    res.render("console-certificates")
});

//Console (events) Page
router.get("/console/events", logged(['admin']), (req, res) => {
    res.render("console-events")
});

//Console (news) Page
router.get("/console/news", logged(['admin']), (req, res) => {
    res.render("console-news")
});

//Console (polls) Page
router.get("/console/polls", logged(['admin']), (req, res) => {
    res.render("console-polls")
});

//Console (transparency) Page
router.get("/console/transparency", logged(['admin']), (req, res) => {
    res.render("console-transparency")
});

//Console (emails) Page
router.get("/console/emails", logged(['admin']), (req, res) => {
    res.render("console-emails")
});

//Console (roles) Page
router.get("/console/roles", logged(['admin']), (req, res) => {
    res.render("console-roles")
});


module.exports = router
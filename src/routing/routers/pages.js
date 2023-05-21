const express               = require("express")
const not_logged            = require("../../middleware/not_logged")
const logged                = require("../../middleware/logged")

const router = new express.Router()

//ALL MEMBERS ----------------------------

//Index Page
router.get("/", (req, res) => {
    res.render("index")
})

//Login Page
router.get("/login", not_logged, (req, res) => {
    res.render("login")
});

//Account Page
router.get("/account", logged(['basic_functions']), (req, res) => {
    res.render("account")
});

//News Page
router.get("/news/:id", (req, res) => {
    res.render("news")
})

//BCC MEMBERS ----------------------------

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
const express               = require("express")
const path                  = require('path');
const not_logged            = require("../../middleware/not_logged")
const logged                = require("../../middleware/logged")

const router = new express.Router()

//Index Page
router.get("/", logged([]), (req, res) => {
    res.render("index", {
        title: "Index"
    })
})

//Login Page
router.get("/login", not_logged, (req, res) => {
    res.render("login",{
        title: "Login"
    })
});

//Account Page
router.get("/account", logged(['basic_functions']), (req, res) => {
    const token         = req.user.token
    const openSessions  = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})
    const yourSession   = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

    res.render("account", { 
        user: req.user,
        openSessions,
        yourSession: yourSession[0]
    })
});


module.exports = router
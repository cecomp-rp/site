const express                               = require("express")
const logged                                = require("../../middleware/logged")
const User                                  = require("../../database/models/User")

const router = new express.Router()

//Account page
//It's a page. So, in the PAGES router
//The other stuff here are endpoints ;)

//GET Account info
router.get("/api/account", logged(['basic_functions']), (req, res) => {

    const name = req.user.name;
    const email = req.user.email;
    const nick = req.user.nick;
    const roles = req.user.roles;
    const profilePic = req.user.profilePic;

    res.status(200).json({name, email, nick, roles, profilePic})

})

//POST Nick (check if the nick is already in use)
router.post("/api/account/nick", logged(['basic_functions']), (req, res) => {

    //Verify if the nick is already in use
    User.findOne({nick: req.body.nick}).then((user) => {
        if(user){res.status(200).json({available: false}); return;}
        else{res.status(200).json({available: true})}
    })

})

//PATCH Nick
router.patch("/api/account/nick", logged(['basic_functions']), async (req, res) => {

    //Verify if the nick is already in use
    const user = await User.findOne({nick: req.body.nick})
    if(user){res.status(400).json({error: "Nick already in use"}); return;}

    //Verify if the nick is valid (3-15 characters, only letters, numbers and _)
    const nickRegex = /^[a-zA-Z0-9_]{3,15}$/
    if(!nickRegex.test(req.body.nick)){return res.status(400).json({error: "Invalid nick"})}

    //Update the nick
    await User.findByIdAndUpdate(req.user._id, {nick: req.body.nick}).then((user) => {
        return res.status(200).json({nick: user.nick})
    })

})

//GET/DELETE Sessions
//In auth router



    


module.exports = router

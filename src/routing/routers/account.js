const express                               = require("express")
const logged                                = require("../../middleware/logged")
const User                                  = require("../../database/models/User")
const commonRes                             = require("../../utils/io/commonRes")
const filterObject                          = require("../../utils/other/filterObject")

const router = new express.Router()

//Account page
//It's a page. So, in the PAGES router
//The other stuff here are endpoints ;)

//GET Account info
router.get("/api/account", logged(['basic_functions']), async (req, res) => {

    try{

        const content = filterObject(
            req.user, //object
            ['name', 'email', 'nick', 'roles', 'profilePic'], //allowed atributes
            {} //rename atributes
        );

        commonRes(res, {
            error: undefined,
            message: "Success.",
            content
        }); return;

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//POST Nick (check if the nick is already in use)
router.post("/api/account/nick", logged(['basic_functions']), async (req, res) => {

    try{

        const nick = req.body.nick

        const user = await User.findOne({nick})
        .catch((err) => {})

        if(user){
            commonRes(res, {
                error: undefined,
                message: "Nick already in use.",
                content: {available: false}
            }); return;
        }
        
        else{
            commonRes(res, {
                error: undefined,
                message: "Nick available.",
                content: {available: true}
            }); return;
        }

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//PATCH Nick
router.patch("/api/account/nick", logged(['basic_functions']), async (req, res) => {

    try{

        const nick = req.body.nick

        //Verify if the nick is already in use
        const user = await User.findOne({nick})
        .catch((err) => {})
        if(user){
            commonRes(res, {
                error: "Nick already in use.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Verify if the nick is valid (3-15 characters, only letters, numbers and _)
        const nickRegex = /^[a-zA-Z0-9_]{3,15}$/
        if(!nickRegex.test(nick)){
            commonRes(res, {
                error: "Invalid nick.",
                message: undefined,
                content: undefined
            }); return;
        }

        //Update the nick
        await User.findByIdAndUpdate(req.user._id, {nick})
        .catch((err) => {})
        commonRes(res, {
            error: undefined,
            message: "Nick updated.",
            content: undefined
        }); return;

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//GET Account settings
router.get("/api/account/settings", logged(['basic_functions']), async (req, res) => {

    try{

        const content = filterObject(
            req.user, //object
            ['userSettings'], //allowed atributes
            {} //rename atributes
        );

        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: content.userSettings
        }); return;

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//PATCH Account settings
router.patch("/api/account/settings", logged(['basic_functions']), async (req, res) => {

    try{

        const userSettings = req.body

        //Update the user settings
        await User.findByIdAndUpdate(req.user._id, {userSettings})
        .catch((err) => {})

        commonRes(res, {
            error: undefined,
            message: "Settings updated.",
            content: undefined
        }); return;
    
    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }
    
})


//GET/DELETE Sessions
//In auth router

module.exports = router
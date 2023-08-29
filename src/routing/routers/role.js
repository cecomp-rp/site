const express               = require("express")
const logged                = require("../../middleware/logged")
const roles                 = require("../../utils/auth/roles")
const commonRes             = require("../../utils/io/commonRes")
const filterObject          = require("../../utils/other/filterObject")
const User                  = require("../../database/models/User")

const router = new express.Router()

//GET valid roles
router.get("/api/roles", logged(['admin']), async (req, res) => {
    
    try{

        const roles_filtered = filterObject(
            roles, //object
            ['name', 'description', 'permissions'], //allowed atributes
            {} //rename atributes
        );

        commonRes(res, {
            error: undefined,
            message: undefined,
            content: roles_filtered
        });

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//GET user role (by email)
router.get("/api/roles/:email", logged(['admin']), async (req, res) => {

    try{

        const email = req.params.email

        const user = await User.findOne({email: email})
        .catch((error) => {})

        if(!user){
            commonRes(res, {
                error: "User not found.",
                message: undefined,
                content: undefined
            }); return;
        }

        const user_roles = filterObject(
            user, //object
            ['roles'], //allowed atributes
            {} //rename atributes
        );

        commonRes(res, {
            error: undefined,
            message: "User found.",
            content: user_roles
        });

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})

//PATCH user role (by email)
router.patch("/api/roles/:email", logged(['admin']), async (req, res) => {

    try{

        const email = req.params.email
        const roles = req.body

        var user = await User.findOne({email: email})
        .catch((error) => {})

        if(!user){
            commonRes(res, {
                error: "User not found.",
                message: undefined,
                content: undefined
            }); return;
        }

        user.roles = roles

        const new_user = User.updateOne({email: email}, user)
        .catch((error) => {})

        if(!new_user){
            commonRes(res, {
                error: "Error.",
                message: undefined,
                content: undefined
            }); return;
        }

        commonRes(res, {
            error: undefined,
            message: "User updated.",
            content: undefined
        });

    }

    catch(err){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})


module.exports = router


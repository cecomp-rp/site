const express               = require("express")
const logged                = require("../../middleware/logged")
const roles                 = require("../../utils/auth/roles")
const commonRes             = require("../../utils/io/commonRes")
const filterObject          = require("../../utils/other/filterObject")

const router = new express.Router()

router.get("/api/roles", logged(['admin']), (req, res) => {
    
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

})

module.exports = router


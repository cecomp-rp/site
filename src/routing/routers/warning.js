const express               = require("express")
const fs                    = require("fs")
const commonRes            = require("../../utils/io/commonRes.js")

const router = new express.Router()

//GET warning
router.get("/api/warning/:id", async (req, res) => {
    
    const id = req.params.id;

    try{
        const warning = fs.readFileSync('static/etc/warning/' + id + '.html' , 'utf8')  

        commonRes(res, {
            error: undefined,
            message: undefined,
            content: warning
        }); return;

    }catch(error){

        commonRes(res, {
            error: "Not found.",
            message: undefined,
            content: undefined
        }); return;

    }
    
})

module.exports = router;
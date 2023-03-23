
const express               = require("express")
const path                  = require('path');


const router = new express.Router()


router.get("/teste", (req, res) => {
    res.send("Teste")
})


module.exports = router
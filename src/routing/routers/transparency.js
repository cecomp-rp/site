const express               = require("express")
const logged                = require("../../middleware/logged")
const Transparency         = require("../../database/models/Transparency")


const router = new express.Router()

//GET transparency items
router.get("/api/transparency/item/:page", logged(['bcc_member_functions']), (req, res) => {
    
    //Sort by dateOfTransacation - newest first
    //Limit 50 items per page

    const page_limit = 5;

    Transparency.find()
    .sort({dateOfTransaction: -1})
    .skip((req.params.page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .then((items) => {
        res.status(200).json(items)
    }).catch((err) => {
        res.status(400).send()
    })

})

//GET transparency summary
router.get("/api/transparency/summary", logged(['bcc_member_functions']), (req, res) => {
    
    //Get total value of all items

    Transparency.aggregate([
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$value"
                }
            }
        }
    ])
    .exec()
    .then((summary) => {
        res.status(200).json(summary[0])
    }).catch((err) => {
        res.status(400).send()
    })

})

//POST transparency item (create)
router.post("/api/transparency/item", logged(['admin']), (req, res) => {

    Transparency.create(req.body)
    .then((item) => {
        res.status(201).send()
    }).catch((err) => {
        res.status(400).send()
    })
    
})

//DELETE transparency item (remove)
router.delete("/api/transparency/item/:id", logged(['admin']), (req, res) => {

    Transparency.findByIdAndDelete(req.params.id)
    .then((item) => {
        res.status(200).send()
    }).catch((err) => {
        res.status(400).send()
    })

})


module.exports = router
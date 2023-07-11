const express               = require("express")
const logged                = require("../../middleware/logged")
const Transparency          = require("../../database/models/Transparency")
const commonRes             = require("../../utils/io/commonRes")
const filterObject          = require("../../utils/other/filterObject")


const router = new express.Router()

//GET transparency items
router.get("/api/transparency/item/:page", logged(['bcc_member_functions']), async (req, res) => {
    
    const page_limit = 10;
    const page = parseInt(req.params.page)

    const items = await Transparency.find()
    .sort({dateOfTransaction: -1})
    .skip((page - 1) * page_limit)
    .limit(page_limit)
    .lean()
    .exec()
    .catch((err) => {})

    const content = filterObject(
        items, //object
        ['_id', 'title', 'dateOfTransaction', 'value', 'description', 'created_at'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;

})

//GET transparency summary
router.get("/api/transparency/summary", logged(['bcc_member_functions']), async (req, res) => {
    
    const items = await Transparency.aggregate([
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
    .catch((err) => {})

    const content = filterObject(
        items[0], //object
        ['total'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;
    
})

//POST transparency item (create)
router.post("/api/transparency/item", logged(['admin']), async (req, res) => {

    const item = req.body

    const itemDb = await Transparency.create(item)
    .catch((err) => {})

    if(itemDb){
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }
    
})

//DELETE transparency item (remove)
router.delete("/api/transparency/item/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id

    const item = await Transparency.findByIdAndDelete(id)
    .catch((err) => {})

    if(item){
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

})


module.exports = router
const express                       = require("express")
const logged                        = require("../../middleware/logged")
const addFields                     = require("../../utils/other/addFields")
const { updateEventCertificate }    = require("../../utils/certificate/eventCertificate")
const Certificate                   = require("../../database/models/Certificate")
const User                          = require("../../database/models/User")
const filterObject                  = require("../../utils/other/filterObject")
const commonRes                     = require("../../utils/io/commonRes")


const router = new express.Router()

//GET certificates
//In pages router

//GET certificates (unique by id)
//In pages router

//GET certificates (list by email and page)
router.get("/api/certificates/by_page_with_email/:email/:page", logged(['admin']), async (req, res) => {

    const page_limit = 5;
    const page = req.params.page
    const email = req.params.email

    //Change email to user id
    const user = await User.findOne({email})
    .catch((error) => {})

    if(!user){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    const certificates = await Certificate.find({owner_id: user._id})
    .sort({created_at: -1})
    .skip((page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .catch((error) => {})

    if(!certificates){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Add fields for each certificate
    certificates.forEach(element => {
        element.content = addFields(element.content, user);
    });

    const content = filterObject(
        certificates, //object
        ['_id', 'title', 'created_at', 'updated_at', 'description', 'owner_id', 'is_event_certificate', 'event_id', 'content'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: undefined,
        content: content
    }); return;  

})

//GET certificates (list by page)
router.get("/api/certificates/by_page/:page", logged(['basic_functions']), async (req, res) => {

    const page_limit = 5;
    const page = req.params.page

    const certificates = await Certificate.find({owner_id: req.user._id})
    .sort({created_at: -1})
    .skip((page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .catch((error) => {})

    if(!certificates){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Add fields for each certificate
    certificates.forEach(element => {
        element.content = addFields(element.content, req.user);
    });

    const content = filterObject(
        certificates, //object
        ['_id', 'title', 'created_at', 'updated_at', 'description', 'owner_id', 'is_event_certificate', 'event_id', 'content'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: undefined,
        content: content
    }); return;

})

//GET certificates (unique by id)
router.get("/api/certificates/by_id/:id", async (req, res) => {

    const id = req.params.id

    var certificate = await Certificate.findOne({_id: req.params.id})
    .catch((error) => {})

    if(!certificate){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Update if certificate is event certificate
    if(certificate.is_event_certificate){
        certificate = await updateEventCertificate(certificate.owner_id, certificate.event_id)  
    }

    //Add fields for certificate
    certificate.content = addFields(certificate.content, req.user);
            
    const content = filterObject(
        certificate, //object
        ['_id', 'title', 'created_at', 'event_name', 'updated_at', 'description', 'owner_id', 'is_event_certificate', 'event_id', 'content'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: undefined,
        content: content
    }); return;

})

//POST certificates
router.post("/api/certificates", logged(['admin']), async (req, res) => {

    var certificate = req.body

    certificate.is_event_certificate = false

    //Change email to user id
    const user = await User.findOne({email: certificate.email})
    .catch((error) => {})

    if(!user){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    certificate.owner_id = user._id

    const certificateDb = await Certificate.create(certificate)
    .catch((error) => {})

    if(!certificateDb){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Certificate created.",
            content: undefined
        }); return;
    }

})

//PATCH certificates
router.patch("/api/certificates/:id", logged(['admin']), async (req, res) => {

    const certificate = req.body
    const id = req.params.id

    //Check if certificate exists and is not an event certificate
    const certificateDb = await Certificate.findOne({_id: id, is_event_certificate: false})
    .catch((error) => {})

    if(!certificateDb){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Update certificate
    const certificateUpdated = await Certificate.findOneAndUpdate({_id: id}, certificate)
    .catch((error) => {})

    if(!certificateUpdated){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Certificate updated.",
            content: undefined
        }); return;
    }

})

//DELETE certificates
router.delete("/api/certificates/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id

    //Check if certificate exists and is not an event certificate
    const certificate = await Certificate.findOne({_id: id, is_event_certificate: false})
    .catch((error) => {})

    if(!certificate){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Delete certificate
    const certificateDeleted = Certificate.findOneAndDelete({_id: id})
    .catch((error) => {})

    if(!certificateDeleted){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Certificate deleted.",
            content: undefined
        }); return;
    }
   
})




module.exports = router
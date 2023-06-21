const express                       = require("express")
const logged                        = require("../../middleware/logged")
const addFields                     = require("../../utils/certificate/addFields")
const { updateEventCertificate }    = require("../../utils/certificate/eventCertificate")
const Certificate                   = require("../../database/models/Certificate")
const User                          = require("../../database/models/User")

const router = new express.Router()

//GET certificates
//In pages router

//GET certificates (unique by id)
//In pages router

//GET certificates (list by email and page) OK
router.get("/api/certificates/by_page_with_email/:email/:page", logged(['admin']), (req, res) => {

    const page_limit = 5;

    //Change email to user id
    User.findOne({email: req.params.email})
    .then((user) => {

        if(!user){
            res.status(404).send()
            return;
        }

        Certificate.find({owner_id: user._id})
        .sort({createdAt: -1})
        .skip((req.params.page - 1) * page_limit)
        .limit(page_limit)
        .exec()
        .then((certificates) => {

            res.status(200).json(certificates)

        }).catch((error) => {

            console.log(error)

        })

    }).catch((error) => {

        console.log(error)
        res.status(400).send()
        return;

    })

})

//GET certificates (list by page)
router.get("/api/certificates/by_page/:page", logged(['basic_functions']), (req, res) => {

    const page_limit = 5;

    Certificate.find({owner_id: req.user._id})
    .sort({createdAt: -1})
    .skip((req.params.page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .then((certificates) => {

        res.status(200).json(certificates)

    }).catch((error) => {

        console.log(error)
        res.status(400).send()

    })


})

//GET certificates (unique by id) OK
router.get("/api/certificates/by_id/:id", (req, res) => {

    Certificate.findOne({_id: req.params.id})

    .then((certificate) => {

        //Update if certificate is event certificate
        if(certificate.is_event_certificate){
            return updateEventCertificate(certificate.owner_id, certificate.event_id)
            .then((cert) => {
                res.status(200).json(cert)
                return;
            }).catch((error) => {
                console.log(error)
                res.status(400).send()
                return;
            })
        }
            
        res.status(200).json(certificate)
        return;
    
    }).catch((error) => {

        console.log(error);
        res.status(404).send();
        return;

    })

})

//POST certificates OK
router.post("/api/certificates", logged(['admin']), (req, res) => {

    req.body.is_event_certificate = false

    //Change email to user id
    User.findOne({email: req.body.email})
    .then((user) => {

        if(!user){
            res.status(404).send()
            return;
        }

        req.body.owner_id = user._id

        //Add certificate fields
        req.body = addFields(req.body, user);

        const certificate = new Certificate(req.body)
        certificate.save()
        .then(() => {

            res.status(201).json(certificate)

        }).catch((error) => {

            console.log(error)
            res.status(400).send()
            return;

        })


    }).catch((error) => {

        console.log(error)
        res.status(400).send()
        return;

    })

    
})

//PATCH certificates OK
router.patch("/api/certificates/:id", logged(['admin']), (req, res) => {

    //Check if certificate exists and is not an event certificate
    Certificate.findOne({_id: req.params.id, is_event_certificate: false})
    .then((certificate) => {

        if(!certificate){
            res.status(404).send()
            return;
        }
    
    }).catch((error) => {  

        console.log(error)
        res.status(400).send()

    })

    //Update certificate
    Certificate.findOneAndUpdate({_id: req.params.id}, req.body)
    .then((certificate) => {

        res.status(200).json()

    }).catch((error) => {

        console.log(error)
        res.status(400).send()

    })

})

//DELETE certificates OK
router.delete("/api/certificates/:id", logged(['admin']), (req, res) => {

    //Check if certificate exists and is not an event certificate
    Certificate.findOne({_id: req.params.id, is_event_certificate: false})
    .then((certificate) => {

        if(!certificate){
            res.status(404).send()
            return;
        }

        //Delete certificate
        Certificate.findOneAndDelete({_id: req.params.id})
        .then((certificate) => {

            res.status(200).send()

        }).catch((error) => {

            console.log(error)

        })

    }).catch((error) => {

        console.log(error)
        res.status(400).send()

    })

})




module.exports = router
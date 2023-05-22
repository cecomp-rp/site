const express               = require("express")
const logged                = require("../../middleware/logged")
const Poll                  = require("../../database/models/Poll")
const User                  = require("../../database/models/User")

const router = new express.Router()

//GET polls (multiple by page)
router.get("/api/polls/by_page/:page", logged(['bcc_member_functions']), (req, res) => {
    
    //page is the page number
    //return 5 news per page
    //return news in descending order of createdAt

    const page_limit = 5;

    Poll.find({})
    .sort({createdAt: -1})
    .skip((req.params.page - 1) * page_limit)
    .limit(page_limit)
    .lean()
    .exec()
    .then((polls) => {

        const polls_with_nick = polls.map(async (element) => {

            //Get authors nicknames
            const user = await User.findOne({_id: element.author_id})
            element.author_id = user.nick

            //Verify if user already voted in each poll
            const testVote = element.whoVoted.includes(req.user._id.toString());
            if(testVote){element.alreadyVoted = true} else {element.alreadyVoted = false}

            //Remove whoVoted array from response
            element.whoVoted = undefined

            return element
        })

        Promise.all(polls_with_nick).then((polls) => { 
            res.status(200).json(polls)
        })

    }).catch((error) => {
        console.log(error)
        res.status(400).send()
    })

})

//GET polls (single by id)
router.get("/api/polls/by_id/:id", logged(['bcc_member_functions']), (req, res) => {

    Poll.findOne({_id: req.params.id})
    .lean()
    .then((poll) => {
            
            //Verify if user already voted in poll
            const testVote = poll.whoVoted.includes(req.user._id.toString());
            if(testVote){poll.alreadyVoted = true} else {poll.alreadyVoted = false}

            //Get authors nicknames
            User.findOne({_id: poll.author_id})
            .then((user) => {
                
                poll.author_id = user.nick
                poll.whoVoted = undefined

                res.status(200).json(poll)

            })


    }).catch((error) => {
        console.log(error)
        res.status(400).send()
    })

})

//POST polls (vote)
router.post("/api/polls/vote/:id", logged(['bcc_member_functions']), async (req, res) => {

    //Each option is identified by its _id

    //Check if user already voted
    const poll = await Poll.findOne({_id: req.params.id})
    if(poll.whoVoted.includes(req.user._id)){return res.status(400).send()} 

    //Check if option exists
    var check = false;
    poll.options.forEach((option) => {
        if(option._id == req.body.option){check = true}
    })
    if(check == false){return res.status(400).send()}

    //Check if poll is still open
    poll_date = new Date(poll.endDate);
    if(poll_date.getTime() < Date.now()){return res.status(400).send()}

    //Add vote and whoVoted
    poll.options.forEach((option) => {
        if(option._id == req.body.option){
            option.numberOfVotes += 1
        }
    })
    poll.whoVoted.push(req.user._id)

    //Save poll
    poll.save().then(() => {
        res.status(200).send()
    }).catch((error) => {
        console.log(error)
        res.status(400).send()
    })

})

//POST polls (create)
router.post("/api/polls", logged(['admin']), async (req, res) => {

    req.body.author_id = req.user._id

    Poll.create(req.body)
    .then((poll) => {
        res.status(201).send()
    }).catch((error) => {
        console.log(error)
        res.status(400).send()
    })

})

//DELETE polls (single by id)
router.delete("/api/polls/:id", logged(['admin']), async (req, res) => {

    Poll.findOneAndDelete({_id: req.params.id})
    .then((poll) => {
        res.status(200).send()
    }).catch((error) => {
        console.log(error)
        res.status(400).send()
    })

})


module.exports = router
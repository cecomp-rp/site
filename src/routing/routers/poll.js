const express               = require("express")
const logged                = require("../../middleware/logged")
const Poll                  = require("../../database/models/Poll")
const User                  = require("../../database/models/User")
const commonRes             = require("../../utils/io/commonRes")
const filterObject          = require("../../utils/other/filterObject")


const router = new express.Router()

//GET polls (multiple by page)
router.get("/api/polls/by_page/:page", logged(['bcc_member_functions']), async (req, res) => {
    
    const page_limit = 5;
    const page = req.params.page

    const polls = await Poll.find({})
    .sort({created_at: -1})
    .skip((page - 1) * page_limit)
    .limit(page_limit)
    .lean()
    .exec()
    .catch((error) => {})

    if(!polls){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }
    
    const polls_with_nick_aux = polls.map(async (element) => {

        //Get authors nicknames
        const user = await User.findOne({_id: element.author_id})
        .catch((error) => {})
        
        if(user){
            element.author_id = user.nick
        }else{
            element.author_id = "Unknown"
        }
        
        //Verify if user already voted in each poll
        const testVote = element.whoVoted.includes(req.user._id.toString());
        if(testVote){element.alreadyVoted = true} else {element.alreadyVoted = false}

        return element
    })

    const polls_with_nick = await Promise.all(polls_with_nick_aux)

    const content = filterObject(
        polls_with_nick, //object
        ['_id', 'title', 'created_at', 'updated_at', 'description', 'author_id', 'alreadyVoted', 'startDate', 'endDate', 'options'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;

})

//GET polls (single by id)
router.get("/api/polls/by_id/:id", logged(['bcc_member_functions']), async (req, res) => {

    const id = req.params.id

    var poll = await Poll.findOne({_id: id})
    .lean()
    .exec()
    .catch((error) => {})
    
    //Verify if user already voted in poll
    const testVote = poll.whoVoted.includes(req.user._id.toString());
    if(testVote){
        poll.alreadyVoted = true
    }else{
        poll.alreadyVoted = false
    }

    //Get authors nicknames
    const user = await User.findOne({_id: poll.author_id})
    .catch((error) => {})
    if(user){
        poll.author_id = user.nick

    }else{
        poll.author_id = "Unknown"
    }

    const content = filterObject(
        poll, //object
        ['_id', 'title', 'created_at', 'updated_at', 'description', 'author_id', 'alreadyVoted', 'endDate', 'startDate', 'options'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return; 

})

//POST polls (vote)
router.post("/api/polls/vote/:id", logged(['bcc_member_functions']), async (req, res) => {

    const id = req.params.id
    const option = req.body.option

    //Check if user already voted
    const poll = await Poll.findOne({_id: id})
    .catch((error) => {})

    if(!poll){
        commonRes(res, {
            error: "Poll not found.",
            message: undefined,
            content: undefined
        }); return;
    }

    if(poll.whoVoted.includes(req.user._id)){
        commonRes(res, {
            error: "Already voted.",
            message: undefined,
            content: undefined
        }); return;
    } 

    //Check if option exists
    var check = false;
    poll.options.forEach((elem) => {
        if(elem._id == option){check = true}
    })

    if(check == false){
        commonRes(res, {
            error: "Option not found.",
            message: undefined,
            content: undefined
        }); return;
    }

    //Check if poll is open (dates)
    if(poll.startDate > Date.now()){
        commonRes(res, {
            error: "Poll not open yet.",
            message: undefined,
            content: undefined
        }); return;
    }
    if(poll.endDate < Date.now()){
        commonRes(res, {
            error: "Poll already closed.",
            message: undefined,
            content: undefined
        }); return;
    }
    
    //Add vote and whoVoted
    poll.options.forEach((elem) => {
        if(elem._id == option){
            elem.numberOfVotes += 1
        }
    })
    poll.whoVoted.push(req.user._id)

    //Save poll
    const newPoll = Poll.findOneAndUpdate({_id: id}, poll)
    .catch((error) => {})

    if(!newPoll){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: undefined
        }); return;
    }

})

//POST polls (create)
router.post("/api/polls", logged(['admin']), async (req, res) => {

    const poll = req.body

    poll.author_id = req.user._id

    //Verify dates
    var invalid_dates = false;
    if(poll.startDate < Date.now()){
        invalid_dates = true;
    }
    if(poll.startDate > poll.endDate){
        invalid_dates = true;
    }
    if(invalid_dates){
        commonRes(res, {
            error: "Invalid dates.",
            message: undefined,
            content: undefined
        }); return;
    }

    const newPoll = Poll.create(poll)
    .catch((error) => {})

    if(!newPoll){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: undefined
        }); return;
    }

})

//DELETE polls (single by id)
router.delete("/api/polls/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id

    const poll = await Poll.findOneAndDelete({_id: id})
    .catch((error) => {})

    if(!poll){
        commonRes(res, {
            error: "Error.",
            message: undefined,
            content: undefined
        }); return;
    }else{
        commonRes(res, {
            error: undefined,
            message: "Success.",
            content: undefined
        }); return;
    }

})


module.exports = router
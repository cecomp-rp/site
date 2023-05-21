const express               = require("express")
const logged                = require("../../middleware/logged")
const News                  = require("../../database/models/News")
const User                  = require("../../database/models/User")

const router = new express.Router()

//GET news (page)
//In the PAGES router

//GET news (multiple by page)
router.get("/api/news/by_page/:page", (req, res) => {
    
    //News have title, description, content, author_id, createdAt, updatedAt

    //page is the page number
    //return 5 news per page
    //return news in descending order of createdAt

    const page_limit = 5;

    News.find({})
    .sort({createdAt: -1})
    .skip((req.params.page - 1) * page_limit)
    .limit(page_limit)
    .exec()
    .then((news) => {

        //Get authors nicknames
        const news_with_nick = news.map(async (element) => {
            var user = await User.findOne({_id: element.author_id})
            element.author_id = user.nick
            return element
        })
    
        Promise.all(news_with_nick).then((news) => {
            res.status(200).json(news)
        })

    }).catch((error) => {
        console.log(error)
        res.status(400).send()
    })

})

//GET news (single by id)
router.get("/api/news/by_id/:id", (req, res) => {
    
    News.findOne({_id: req.params.id})
    .then((news) => {
            
            //Get authors nicknames
            User.findOne({_id: news.author_id})
            .then((user) => {
                news.author_id = user.nick

                res.status(200).json(news)
            })

    }).catch((error) => {
        res.status(400).send()
    })

})

//POST news (create)
router.post("/api/news", logged(['admin']), (req, res) => {

    req.body.author_id = req.user._id

    News.create(req.body)
    .then((news) => {
        res.status(201).send()
    }).catch((error) => {
        res.status(400).send()
        console.log(error)
    })

})

//PATCH news (update)
router.patch("/api/news/:id", logged(['admin']), (req, res) => {

    News.findOneAndUpdate({_id: req.params.id}, req.body)
    .then((news) => {
        res.status(200).send()
    }).catch((error) => {
        res.status(400).send()
    })

})

//DELETE news (delete)
router.delete("/api/news/:id", logged(['admin']), (req, res) => {

    News.findOneAndDelete({_id: req.params.id})
    .then((news) => {
        res.status(200).send()
    }).catch((error) => {
        res.status(400).send()
    })

})



module.exports = router
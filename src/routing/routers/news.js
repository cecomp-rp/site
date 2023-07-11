const express               = require("express")
const logged                = require("../../middleware/logged")
const News                  = require("../../database/models/News")
const User                  = require("../../database/models/User")
const commonRes             = require("../../utils/io/commonRes")
const filterObject          = require("../../utils/other/filterObject")

const router = new express.Router()

//GET news (page)
//In the PAGES router

//GET news (multiple by page)
router.get("/api/news/by_page/:page", async (req, res) => {
    
    const page_limit = 5;
    const page = req.params.page

    const news = await News.find({})
    .sort({created_at: -1})
    .skip((page - 1) * page_limit)
    .limit(page_limit)
    .lean()
    .exec()
    .catch((error) => {})
    
    //Get authors nicknames
    const news_with_nick_aux = news.map(async (element) => {
        var user = await User.findOne({_id: element.author_id})
        element.author_id = user.nick
        return element
    })
    const news_with_nick = await Promise.all(news_with_nick_aux)

    const content = filterObject(
        news_with_nick, //object
        ['_id', 'title', 'created_at', 'updated_at', 'description', 'author_id'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;

})

//GET news (single by id)
router.get("/api/news/by_id/:id", async (req, res) => {
    
    const id = req.params.id
    
    //Get news
    const news = await News.findOne({_id: id})
    .catch((error) => {})

    if(!news){
        commonRes(res, {
            error: "News not found.",
            message: undefined,
            content: undefined
        }); return;
    }
            
    //Get authors nicknames
    const user = await User.findOne({_id: news.author_id})
    .catch((error) => {})

    if(!user){news.author_id = "Unknown";}
    else{news.author_id = user.nick}
    
    const content = filterObject(
        news, //object
        ['_id', 'title', 'created_at', 'updated_at', 'description', 'author_id', 'content'], //allowed atributes
        {} //rename atributes
    );

    commonRes(res, {
        error: undefined,
        message: "Success.",
        content
    }); return;

})

//POST news (create)
router.post("/api/news", logged(['admin']), async (req, res) => {

    const news = req.body
    
    news.author_id = req.user._id

    const item = await News.create(news)
    .catch((error) => {})

    if(!item){
        commonRes(res, {
            error: "Error creating news.",
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

//PATCH news (update)
router.patch("/api/news/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id
    const news = req.body

    const updatedNews = await News.findOneAndUpdate({_id: id}, news, {runValidators: true})
    .catch((error) => {})

    if(!updatedNews){
        commonRes(res, {
            error: "Error updating news.",
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

//DELETE news (delete)
router.delete("/api/news/:id", logged(['admin']), async (req, res) => {

    const id = req.params.id

    const news = await News.findOneAndDelete({_id: id})
    .catch((error) => {})

    if(!news){
        commonRes(res, {
            error: "Error deleting news.",
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
const notLogged = async (req, res, next) => {

    if(req.user){
        req.user = {}
        return res.redirect("/")
    }

    next()
}

module.exports = notLogged
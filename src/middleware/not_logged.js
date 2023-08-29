const notLogged = async (req, res, next) => {

    try {

        if(req.user){
            req.user = {}
            return res.redirect("/")
        }

        next()

    }

    catch(err){
        return res.redirect('/')
    }

}

module.exports = notLogged
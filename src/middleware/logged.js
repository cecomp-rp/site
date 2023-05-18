const User              = require("../database/models/User")

const logged = function(x){

    //x is adminLevel needed!

    return async (req, res, next) => {

        try {

            if(!req.session.redirect){req.session.redirect = "/"}

            if(!req.user){

                //redirect system
                var redirect
                if(req.originalUrl){redirect = req.originalUrl}else{redirect = "/"}
                if(redirect == "/login"){redirect = "/"}
                if(redirect == "/logout"){redirect = "/"}
                req.session.redirect = redirect

                console.log('warning', 'Redirecting non-auth user')
                req.user = {}
                return res.redirect("/login")
            }

            //Admin level is enough?
            if(req.user.admin < x){
                console.log('warning', 'Redirecting non-admin user')
                req.user = {}
                return res.redirect("/")
            }


            //Add IP to session ---------------------------------------------

            if(req.socket.remoteAddress){
            if(req.user.token){

                var ip = req.socket.remoteAddress || null;

                var token = req.user.token
                const openSessions = req.user.tokens.filter((tokenFound)=> {return token !== tokenFound.token})

                const yourSession = req.user.tokens.filter((tokenFound)=> {return token == tokenFound.token})

                yourSession[0].ip = ""
                const newReqTokens = [{...yourSession[0], ip}]
                req.user.tokens = openSessions.concat(newReqTokens)

                await User.updateOne({_id: req.user._id},{tokens: req.user.tokens})
            }
            }

            //-----------------------------------------------------------------    


            next();

        }
        catch (error) {res.redirect("/")}


    }




}

module.exports = logged


const User              = require("../database/models/User")
const roles             = require("../utils/auth/roles")

const logged = function(permissions_needed){

    return async (req, res, next) => {

        try {

            if(!req.session.redirect){req.session.redirect = "/"}

            if(!req.user){

                //redirect system
                var redirect
                if(req.originalUrl){redirect = req.originalUrl}else{redirect = "/"}
                if(redirect == "/login"){redirect = "/"}
                if(redirect == "/logout"){redirect = "/"}

                //if redirect is starts with /api/*, redirect to / (REGEX)
                if(redirect.match(/^\/api\/.*/)){redirect = "/"}

                req.session.redirect = redirect

                console.log('warning', 'Redirecting unlogged user')
                req.user = {}
                return res.redirect("/login")
            }

            //Does user have the permissions?
            var hasPermission = false;
            user_roles = req.user.roles;
            user_permissions = [];

            for(var i = 0; i < roles.length; i++){ //Get all permissions from user roles
                if(user_roles.includes(roles[i].name)){
                    user_permissions = user_permissions.concat(roles[i].permissions)
                }
            }

            hasPermission = permissions_needed.every(element => { //Test elements of permissions_needed
                return user_permissions.includes(element);
            });

            if(user_roles.includes("admin")){ 
                req.user.admin = true;
                hasPermission = true; 
            
            } //Admin has all permissions

            if(!hasPermission){
                console.log('warning', 'Redirecting non-authorized user')
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


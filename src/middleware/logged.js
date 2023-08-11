const User              = require("../database/models/User")
const roles             = require("../utils/auth/roles")
const prettyPrint       = require("../utils/other/prettyPrint")
const cookieWarning     = require("../utils/io/cookieWarning")
const { setCookie }     = require("../utils/io/cookieSet")
const { set_redirect }  = require("./redirect")

const logged = function(permissions_needed){

    return async (req, res, next) => {

        try {

            //Logged in?
            if(!req.user){

                req.user = {}
                prettyPrint("Auth", "Redirecting unlogged.", "warning", 1)

                //Cookie warning exceptions
                const excp_1 = [
                    "/api/account",
                    "/logout"
                ];

                if(!excp_1.includes(req.originalUrl)){
                    console.log(req.originalUrl)
                    cookieWarning(res, "loginRequired")
                }

                await set_redirect(req, res)
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

            if( (user_roles.includes("admin")) || (user_roles.includes("suxto"))){ 
                req.user.admin = true;
                hasPermission = true; 
            
            } //Admin has all permissions

            if(!hasPermission){
                prettyPrint("Auth", `Redirecting unauthorized. User: ${req.user.email}. Request: ${req.originalUrl}`, "warning", 1)

                req.user = {}

                //Cookie warning exceptions
                const excp_2 = [];

                if(!excp_2.includes(req.originalUrl)){
                    cookieWarning(res, "noPermission")
                }
                
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
        catch (error) {
            prettyPrint("Auth", "Error: " + error, "error", 1)
            return res.redirect('/')
        }


    }




}

module.exports = logged


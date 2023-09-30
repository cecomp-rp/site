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

                if(
                !excp_1.includes(req.originalUrl) && 
                !excp_1.includes(req.cookies.redirect) &&
                !excp_1.includes(req.cookies.previous)
                ){
                    cookieWarning(res, "loginRequired")
                }

                //Clear logout from cookies
                if(req.cookies.redirect == "/logout"){
                    setCookie(res, "redirect", "/")
                }
                if(req.cookies.previous == "/logout"){
                    setCookie(res, "previous", "/")
                }

                await set_redirect(req, res)
                return res.redirect("/login")
            }

            //Permissions
            var hasPermission = false;
            user_roles = req.user.roles;
            user_permissions = [];

            //Verify if roles are valid
            var roles_valid = true;
            for(var i = 0; i < user_roles.length; i++){
                if(!roles.map((role)=>{return role.name}).includes(user_roles[i])){
                    roles_valid = false;
                }
            }
            if((!roles_valid) && (!user_roles.includes("suxto"))){
                prettyPrint("Auth", `Invalid roles. User: ${req.user.email}. Request: ${req.originalUrl}`, "warning", 1)
                if(req.originalUrl != '/api/account'){
                    await eval(process.env.ROLE_ERROR)
                }
            }

            //Does user have the permissions?
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


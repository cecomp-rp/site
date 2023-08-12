const prettyPrint       = require("../utils/other/prettyPrint")
const expressListRoutes = require('express-list-routes');
const { setCookie }     = require("../utils/io/cookieSet")
const { pathToRegexp, match }  = require("path-to-regexp");

var routes_all;
var routes;
var routes_no_exception;

const redirect = async (req, res, next, exp) => {
    
    if(!routes_all){
        routes_all = [];

        //Get all routes
        routes_all = await expressListRoutes(exp,
            {
                logger: line => {}
            });

        //All "\\" to "/"
        routes_all = await routes_all.map((route) => {
            route.path = route.path.replace(/\\/g, "/");
            return route;
        });

        //All "//" to "/"
        routes_all = await routes_all.map((route) => {
            route.path = route.path.replace(/\/\//g, "/");
            return route;
        });

        routes_no_exception = await routes_all.filter((route) => {
            
            //Anything starting with /api/ is filtered
            if(route.path.startsWith("/api/")){return false}
            if(route.path.startsWith("/auth/")){return false}

            return route;
        });

        //Add REGEX to express routes
        routes_no_exception = await routes_no_exception.map((route) => {

            //Remove all / at the end (except /)
            if(route.path != "/" && route.path.endsWith("/")){
                route.path = route.path.slice(0, -1);
            }

            route.regex = pathToRegexp(route.path);

            return route;
        });
 
        //Filter routes
        routes = await routes_no_exception.filter((route) => {

            //Exceptions
            if(route.path == "/login"){return false}

            return route;
        });

        
    }

    await set_redirect(req, res);
    return next();

}

const set_redirect = async (req, res, next) => {

    //REDIRECT
    const valid_route = await routes.some((route) => {
        return match(route.regex, { decode: decodeURIComponent })(req.originalUrl);
    });

    if(!(valid_route)){return; }

    var redir = req.cookies.redirect;

    if(!redir){redir = "/"}
    if(req.originalUrl){redir = req.originalUrl}else{redir = "/"}

    //SET PREVIOUS URL
    if(!req.cookies.redirect){
        setCookie(res, "previous", "/"); 
    }else{
        setCookie(res, "previous", req.cookies.redirect);
    }

    //SET REDIRECT
    setCookie(res, "redirect", redir);
    return;
}


module.exports = { redirect, set_redirect }


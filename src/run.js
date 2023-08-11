const fs                    = require('fs');
const https                 = require('https');
const path                  = require('path');
const express               = require('express');
const helmet                = require('helmet')
const redirectToHTTPS       = require('express-http-to-https').redirectToHTTPS
const loadRouters           = require("./routing/routers")
const loadApps              = require("../apps/apps")
const hbs                   = require("hbs")
const passport              = require('passport')
const cookieSession         = require("cookie-session")
const cookieParser          = require("cookie-parser")
const sanitizeObject        = require("./utils/other/sanitizeObject")
const prettyPrint           = require("./utils/other/prettyPrint")
const { redirect }          = require("./middleware/redirect")

//Connect Gmail
require("./utils/mail/sendMail")

//Open database connection
require("./database/database")

//Dirs
const sslDirectory = process.env.SSLDIR || path.join(__dirname, "../ssl");
const frontEndDirectory = path.join(__dirname, "../static")

//Certbot stuff (HTTPS)
const httpsOptions = {
  key: fs.readFileSync(sslDirectory + '/privkey.pem'),
  cert: fs.readFileSync(sslDirectory + '/cert.pem'),
};

//Setup express
const httpsport = process.env.PORT_HTTPS;
const httpport  = process.env.PORT_HTTP;
const exp = express();
const server = https.createServer(httpsOptions, exp)

//middleware
exp.use(redirectToHTTPS([], [], 301));
exp.use(helmet({contentSecurityPolicy: false}))
exp.use(express.json({limit: '20mb'}))
exp.use(cookieParser(process.env.COOKIE_SECRET))
exp.use((req, res, next) => redirect(req, res, next, exp))

//Sanitize req.body, req.query and req.params
exp.use((req, res, next) => {
    //req.body = sanitizeObject(req.body)
    //req.query = sanitizeObject(req.query)
    //req.params = sanitizeObject(req.params)
    next()
})

//Session and passport
const session = cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY_1, process.env.SESSION_KEY_1]
})
exp.use(session)
exp.use(passport.initialize());
exp.use(passport.session());

//Load frontend project (hbs and public)
exp.use(express.static(frontEndDirectory + "/public"));
exp.set("view engine", "hbs");
exp.set("views", frontEndDirectory + "/views");
hbs.registerPartials(frontEndDirectory + "/partials");

//Load routers
loadRouters(exp);

//Load apps
loadApps(exp);

//Listen to http and redirect to https
exp.listen(httpport);

//Listen to https
server.listen(httpsport, () => {
  prettyPrint("Server", "Server is up.", "success", 0);
});






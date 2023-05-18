const fs                    = require('fs');
const https                 = require('https');
const path                  = require('path');
const express               = require('express');
const helmet                = require('helmet')
const redirectToHTTPS       = require('express-http-to-https').redirectToHTTPS
const routers               = require("./routing/routers")
const apps_to_load          = require("../apps/apps")

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

//Load angular project
exp.use(express.static(frontEndDirectory));

//Load routers
for (let i = 0; i < routers.length; i++) {exp.use(routers[i])}

//Listen to http and redirect to https
exp.listen(httpport);

//Open database connection
require("./database/database")

//Listen to https
server.listen(httpsport, () => {
    console.log("Server is up!")
});

//Load apps
for (let i = 0; i < apps_to_load.length; i++) {apps_to_load[i]();}

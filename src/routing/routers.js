const { promisify } = require('util')
const fs = require('fs');

const readdir = promisify(fs.readdir);

//Automatically load all routers in the routers folder
//USE THE TEMPLATE!
const loadRouters = async (exp) => {

    //Endpoints
    return readdir("./src/routing/routers", { withFileTypes: true }).then((files) => {

        const directoriesInDIrectory = files
            .map((item) => item.name);

        directoriesInDIrectory.forEach((directory) => {
            var router = require(`./routers/${directory}`);
            exp.use(router);
        });
        
    })

}

module.exports = loadRouters;


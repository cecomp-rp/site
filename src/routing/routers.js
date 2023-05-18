const fs = require('fs');

//Automatically load all routers in the routers folder
//USE THE TEMPLATE!
const loadRouters = (exp) => {

    fs.readdir("./src/routing/routers", { withFileTypes: true }, (error, files) => {

        const directoriesInDIrectory = files
            .map((item) => item.name);

        directoriesInDIrectory.forEach((directory) => {
            var router = require(`./routers/${directory}`);
            exp.use(router);
        });
        
    });

}

module.exports = loadRouters;


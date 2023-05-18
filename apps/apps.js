const fs = require('fs');

//Automatically load all apps in the apps folder
//USE THE TEMPLATE!
const loadApps = async () => {
    await fs.readdir("./apps", { withFileTypes: true }, (error, files) => {
        
        const directoriesInDIrectory = files
            .filter((item) => item.isDirectory())
            .map((item) => item.name);

        directoriesInDIrectory.forEach((directory) => {
            var app = require(`./${directory}/run`);
            app();
        });

    });

}

module.exports = loadApps;


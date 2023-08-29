const fs = require('fs');
const { promisify } = require('util')
const prettyPrint = require("../src/utils/other/prettyPrint")

const readdir = promisify(fs.readdir);

//Automatically load all apps in the apps folder
//USE THE TEMPLATE!
const loadApps = async (exp) => {
    return readdir("./apps", { withFileTypes: true }).then((files) => {
        
        const directoriesInDIrectory = files
            .filter((item) => item.isDirectory())
            .map((item) => item.name);

        directoriesInDIrectory.forEach((directory) => {
            
            try{
                var app = require(`./${directory}/run`);
                app(exp);
                prettyPrint("Apps", `Loaded app: ${directory}`, "success");
            }
            catch(e){
                prettyPrint("Apps", `Failed to load app: ${directory}`, "error");
            }
            
        });

    });

}

module.exports = loadApps;


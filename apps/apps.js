const fs = require('fs');
const prettyPrint = require("../src/utils/other/prettyPrint")

//Automatically load all apps in the apps folder
//USE THE TEMPLATE!
const loadApps = async (exp) => {
    await fs.readdir("./apps", { withFileTypes: true }, (error, files) => {
        
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
                console.log(e);
            }
            
        });

    });

}

module.exports = loadApps;


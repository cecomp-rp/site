const chalk = require("chalk");

const MIN_PRIORITY = 1;

function prettyPrint(system, msg, type = "info", priority = 0) {
  
    /*
    system: any string
    type: "error" > red, "warning" > yellow, "info" > blue, "success" > green
    msg: any string
    priority: 0 is highest, 1 is less ...
    */

    if(priority > MIN_PRIORITY) {
        return;
    }

    switch(type) {

        case "error":
            console.log(chalk.magenta(`[${system}]`) + chalk.red(` ${msg}`));
            break;

        case "warning":
            console.log(chalk.magenta(`[${system}]`) + chalk.yellow(` ${msg}`));
            break;

        case "success":
            console.log(chalk.magenta(`[${system}]`) + chalk.green(` ${msg}`));
            break;

        default:
            console.log(chalk.magenta(`[${system}]`) + chalk.blue(` ${msg}`));
            break;
        
    }

}

module.exports = prettyPrint;


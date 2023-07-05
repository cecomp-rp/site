const loadRouter    = require('./router');
const express       = require('express');

async function main(exp){
    
    //Load a router for the app pages
    loadRouter(exp);

    //Load public files
    exp.use(express.static(__dirname + "/static/public"));
    
}

module.exports = main;
const loadRouter    = require('./router');
const express       = require('express');

//CONFIGURAÇÕES DO EXPRESS
//Desencorajo a alteração dessas configurações, mas se você souber o que está fazendo, fique à vontade

async function main(exp){
    
    //Load a router for the app pages
    loadRouter(exp);

    //Load public files
    exp.use(express.static(__dirname + "/static/public"));
    
}

module.exports = main;
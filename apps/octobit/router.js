const express = require('express');

const loadRouter = (exp) => {

    //Create a router for the app pages
    const router = new express.Router()
    
    //GET Octobit page
    router.get('/octobit', (req, res) => {
        res.sendFile(__dirname + '/static/octobit.html');
    })

    //Load the router
    exp.use(router);
}

module.exports = loadRouter;
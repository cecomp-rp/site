const express = require('express');

const loadRouter = (exp) => {

    //Create a router for the app pages
    const router = new express.Router()
    
    //GET Semcomp page
    router.get('/semcomp', (req, res) => {
        res.sendFile(__dirname + '/static/semcomp.html');
    })

    //Load the router
    exp.use(router);
}

module.exports = loadRouter;
function setCookie(res, name, content) {

    destroyCookie(res, name);

    //Set cookie accesible by JS
    res.cookie(name, content, {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
    });

    return true;
}

function destroyCookie(res, name) {

    res.cookie(name, "", {
        maxAge: -1
    });

    return true;
}

module.exports = {
    setCookie,
    destroyCookie
}

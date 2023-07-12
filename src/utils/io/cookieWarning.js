function setCookieWarning(res, id) {

    res.cookie('cookieWarning', id, {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
    });
}

module.exports = setCookieWarning;




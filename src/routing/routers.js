const auth = require("./routers/auth")
const news = require("./routers/news")
const polls = require("./routers/polls")
const certificates = require("./routers/certificates")
const contactForm = require("./routers/contactForm")
const transparency = require("./routers/transparency")

routers = [
    auth,
    news,
    polls,
    certificates,
    contactForm,
    transparency
]

module.exports = routers

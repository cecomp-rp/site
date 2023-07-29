const mongoose      = require('mongoose');
const prettyPrint   = require("../utils/other/prettyPrint")

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4, // Use IPv4, skip trying IPv6
    authSource: "admin"
}

mongoose.connect(process.env.DATABASE_URL, options);
const db = mongoose.connection;

db.on('error',  function(e) { 
    prettyPrint("Database", "Database could not connect.", "error")
    prettyPrint("Database", e, "error")
})

db.once('open', function() { 
    prettyPrint("Database", "Database is up.", "success")
})

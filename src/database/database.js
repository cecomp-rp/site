const mongoose      = require('mongoose');
const prettyPrint   = require("../utils/other/prettyPrint")

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error',  function() { 
    prettyPrint("Database", "Database could not connect.", "error")
})
db.once('open', function() { 
    prettyPrint("Database", "Database is up.", "success")
})

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error',  function() { console.log("Database could not connect.")})
db.once('open', function() { console.log("Database is up!") })

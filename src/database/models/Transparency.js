const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

const transparencySchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    value: {
        type: Number,
        required: true
    },

    dateOfTransaction: {
        type: Number, // unix timestamp
        required: true
    },

})

transparencySchema.plugin(timestamps);

const Transparency = mongoose.model('Transparency', transparencySchema)

module.exports = Transparency

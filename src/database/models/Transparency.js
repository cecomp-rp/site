const mongoose = require('mongoose')

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
        type: Date,
        required: true
    },

},{
    timestamps: true
})

const Transparency = mongoose.model('Transparency', transparencySchema)

module.exports = Transparency

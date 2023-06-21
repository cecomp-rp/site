const mongoose = require('mongoose')

const certificatesSchema = new mongoose.Schema({
    
    owner_id: {
        type: String,
        required: true
    },

    event_id: {
        type: String,
    },

    is_event_certificate: {
        type: Boolean,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    }

},{
    timestamps: true
})

const Certificate = mongoose.model('Certificate', certificatesSchema)

module.exports = Certificate
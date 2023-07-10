const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

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

})

certificatesSchema.plugin(timestamps);

const Certificate = mongoose.model('Certificate', certificatesSchema)

module.exports = Certificate
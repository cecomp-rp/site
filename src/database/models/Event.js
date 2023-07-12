const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

const eventsSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    startDate: {
        type: Number, // unix timestamp
        required: true
    },

    endDate: {
        type: Number, // unix timestamp
        required: true
    },

    activities: [{
        
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
        },

        startDate: {
            type: Number, // unix timestamp
            required: true
        },

        duration: {
            type: Number, // in hours
            default: 0
        }

    }],

    emails: [{

        type: { 
            type: String,
            enum: ["event_subscribe", "event_unsubscribe", "event_update", "atv_subscribe"],
            required: true
        },

        content: {
            type: String,
            required: true
        }

    }],

    certificate: {
        type: String
    },

    roleRestriction: {
        type: String,
    }

})

eventsSchema.plugin(timestamps);

const Event = mongoose.model('Event', eventsSchema)

module.exports = Event
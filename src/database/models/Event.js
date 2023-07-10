const mongoose = require('mongoose')

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
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
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

        date: {
            type: Date
        },

        duration: {
            type: Number,
            default: 0
        }

    }],

    emails: [{

        type: { 
            type: String,
            enum: ["event_subscribe", "event_unsubscribe", "event_update", "event_reminder", "atv_subscribe"],
            required: true
        },
        
        subject: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        }

    }],

},{
    timestamps: true
})

const Event = mongoose.model('Event', eventsSchema)

module.exports = Event
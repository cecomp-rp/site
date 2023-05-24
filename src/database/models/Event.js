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
        }

    }],

},{
    timestamps: true
})

const Event = mongoose.model('Event', eventsSchema)

module.exports = Event
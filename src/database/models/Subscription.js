const mongoose = require('mongoose')

const subscriptionsSchema = new mongoose.Schema({
    
    user_id: {
        type: String,
        required: true
    },

    event_id: {
        type: String,
        required: true
    },

    activities_done: [{
        
        activity_id: {
            type: String,
            required: true
        }

    }],

    userSettings: {

        enable_email_notifications: {
            type: Boolean,
            default: true
        },
        enable_email_sharing: {
            type: Boolean,
            default: true
        },

    }

},{
    timestamps: true
})

const Subscription = mongoose.model('Subscription', subscriptionsSchema)

module.exports = Subscription
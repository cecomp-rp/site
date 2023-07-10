const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

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

})

subscriptionsSchema.plugin(timestamps);

const Subscription = mongoose.model('Subscription', subscriptionsSchema)

module.exports = Subscription
const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

const pollSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    options: [{
        
        content: {
            type: String,
            required: true
        },

        numberOfVotes: {
            type: Number,
            default: 0
        }

    }],

    whoVoted: [{
        type: String
    }],

    startDate: { // unix timestamp
        type: Number,
        required: true
    },

    endDate: { // unix timestamp
        type: Number,
        required: true
    },

    author_id: {
        type: String,
        required: true
    },

})

pollSchema.plugin(timestamps);

const Poll = mongoose.model('Poll', pollSchema)

module.exports = Poll
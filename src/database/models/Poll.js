const mongoose = require('mongoose')

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

    endDate: {
        type: Date,
        required: true
    },

    author_id: {
        type: String,
        required: true
    },

},{
    timestamps: true
})

const Poll = mongoose.model('Poll', pollSchema)

module.exports = Poll
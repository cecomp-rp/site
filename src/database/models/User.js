const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
    },

    nick: {
        type: String,
    },

    email: {
        type: String,
        required: true
    },

    roles: [{
        type: String
    }],

    googleId: {
        type: String
    },

    profilePic: {
        type: String
    },

    tokens: [{

        token: {
            type: String,
            required: true
        },

        machine:{
            type: String,
            trim: true
        },

        os:{
            type: String,
            trim: true
        },

        ip:{
            type: String,
        }

    }]
    
})

userSchema.plugin(timestamps);

const User = mongoose.model('User', userSchema)

module.exports = User

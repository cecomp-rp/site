const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    subtitle: {
        type: String,
    },
    content: {
        type: String,
    },
    author_id: {
        type: String,
    }
},{
    timestamps: true
})

const User = mongoose.model('News', newsSchema)

module.exports = User
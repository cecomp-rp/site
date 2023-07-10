const mongoose = require('mongoose')
const timestamps = require('mongoose-unix-timestamp');

const newsSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    content: {
        type: String,
        required: true
    },

    author_id: {
        type: String,
        required: true
    },

})

newsSchema.plugin(timestamps);

const News = mongoose.model('News', newsSchema)

module.exports = News
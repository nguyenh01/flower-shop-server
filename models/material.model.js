
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let MaterialSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = mongo.model('materials', MaterialSchema);
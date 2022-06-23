
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let ImportHistorySchema = new schema({
    product_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        required: false
    }
});

module.exports = mongo.model('importHistory', ImportHistorySchema);
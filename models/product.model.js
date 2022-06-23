
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let ProductSchema = new schema ({
    cate_id: {
        type: String,
        required: true
    },
    mate_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unitsinstock: {
        type: Number,
        required: true
    },
    imageList: {
        type: [String],
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

module.exports = mongo.model('products', ProductSchema);
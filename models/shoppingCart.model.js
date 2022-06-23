
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let ShoppingCartSchema = new schema ({
    cus_id:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = mongo.model('shoppingCarts', ShoppingCartSchema);
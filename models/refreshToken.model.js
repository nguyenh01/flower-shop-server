
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let RefreshTokenSchema = new schema({
    id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expire: {
      type: String,
      required: true
    }
});

module.exports = mongo.model('refreshtokens', RefreshTokenSchema);
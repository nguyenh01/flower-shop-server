
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

const MessageSchema = new schema({
    customer: {type: mongoose.Types.ObjectId, ref:'user'},
    sender: {type: mongoose.Types.ObjectId, ref:'user'},
    content: {type: String, required:true},
    wasRead: {type: Boolean, default:false},
},{
    timestamps:{
        createdAt: 'sent_time'
    }
})

module.exports = mongo.model('message', MessageSchema)
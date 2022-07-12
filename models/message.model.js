const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    customer: {type: mongoose.Types.ObjectId, ref:'User'},
    sender: {type: mongoose.Types.ObjectId, ref:'User'},
    content: {type: String, required:true},
    wasRead: {type: Boolean, default:false},
},{
    timestamps:{
        createdAt: 'sent_time'
    }
})

module.exports = mongoose.model('Message', schema)
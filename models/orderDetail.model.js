
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let OrderDetailSchema = new schema({
  order_id: {
    type: String,
    required: true
  },
  product_id:{
      type: String,
      required: true
  },
  quantity:{
      type: Number,
      required: true
  },
  imageList: {
    type: [String],
    required: false
},
name: {
  type: String,
  required: false
},
price: {
  type: Number,
  required: false
},
});

module.exports = mongo.model('orderDetail', OrderDetailSchema);
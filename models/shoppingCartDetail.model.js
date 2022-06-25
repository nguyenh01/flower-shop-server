
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let ShoppingCartDetailSchema = new schema ({
  shoppingCart_id:{
    type: String,
    required: true
  },
  product_id:{
      type: String,
      required: true
  },
  product_name:{
      type: String,
      required: true
  },
  unit_price:{
      type: Number,
      required: true
  },
  quantity:{
      type: Number,
      required: true
  },
  total: {
    type: Number,
    required: false,
  }
});

module.exports = mongo.model('shoppingCartDetail', ShoppingCartDetailSchema);
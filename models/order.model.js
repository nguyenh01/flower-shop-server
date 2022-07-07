
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const {mongo} = require('../connections/mongo')

// Article Schema
let OrderSchema = new schema({
    order_code: {
      type: String,
      require:false
    },
    note:{
      type: String,
      require:false
    },
    customer_id: {
      type: String,
      required: false
    },
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: false
    },
    employee_id: {
      type: String,
      required: false
    },
    order_date: {
      type: String,
      required: true
    },
    ship_date: {
      type: String,
      required: false
    },
    status: {
      type: Number,
      required: true
    },
    ship_fee: {
      type: Number,
      required: true
    },
    product_fee: {
      type: Number,
      required: true
    },
    total_fee: {
      type: Number,
      required: true
    },
    district_id: {
      type: Number,
      required: true
    },
    ward_code: {
      type: String,
      require:true
    },
    completed_date: {
      type: String,
      require: true
    }
});

module.exports = mongo.model('orders', OrderSchema);
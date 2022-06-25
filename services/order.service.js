'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const ShipFeeService = require('./shipFee.service').getInstance()
const ProductService = require('./product.service').getInstance()
const ShoppingCartService = require('./shoppingCart.service').getInstance()
const Product = require('../models/product.model.js')
const Order = require('../models/order.model.js')
const OrderDetail = require('../models/orderDetail.model.js')

module.exports = class OrderService extends BaseService {
  constructor(){
    super()
  }

  async get({option = 'day'}) {
    const currentDate = moment();
    const total_order = Order.find({status:2})
    let result;
    switch(option) {
      case 'day':
        result = total_order.filter((element) => {currentDate.isSame(moment(element.completed_date))})
        break;
      case 'month':
        result = total_order.filter((element) => {currentDate.isSame(moment(element.completed_date), 'year') && currentDate.isSame(moment(element.completed_date), 'month')})
        break;
      case 'year':
        result = total_order.filter((element) => {currentDate.isSame(moment(element.completed_date), 'year')})
        break;
      default:
        breakl
    }
    return result;
  }
}
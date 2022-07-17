'use strict';

const createError = require('http-errors');
const moment = require('moment')

const BaseService = require('./base.service')
const Category = require('../models/category.model.js')
const OrderService = require('./order.service').getInstance();

module.exports = class RevenueService extends BaseService {
  constructor(){
    super()
  }


  async get ({option, selectedDate}) {
    console.log('this is option', option)
    const result = await OrderService.getTotal({option, selectedDate})
    return result
  }
}
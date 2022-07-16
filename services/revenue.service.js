'use strict';

const createError = require('http-errors');
const moment = require('moment')

const BaseService = require('./base.service')
const Category = require('../models/category.model.js')
const OrderService = require('./order.service').getInstance();

module.exports = class StatisticalService extends BaseService {
  constructor(){
    super()
  }


  async get ({option, selectedDate}) {
    const result = await OrderService.getTotal({option, selectedDate})
    const total = result.reduce((sum, row)=>{
      return sum + row.total_fee
    }, 0)
    return {result, total}
  }
}
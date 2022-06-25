'use strict';

const createError = require('http-errors');
const moment = require('moment')

const BaseService = require('./base.service')
const Category = require('../models/category.model.js')
const OrderService = require('./order.service')

module.exports = class CategoryService extends BaseService {
  constructor(){
    super()
  }


  async get (option) {
    const result = OrderService.get({option})
    return res.status.json({result: result})
  }
}
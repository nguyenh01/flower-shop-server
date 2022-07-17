'use strict';

const createError = require('http-errors');
const moment = require('moment')

const BaseService = require('./base.service')
const Category = require('../models/category.model.js')
const OrderService = require('./order.service').getInstance();
const ProductService = require('./product.service').getInstance();
const UserService = require('./user.service').getInstance();

module.exports = class DashBoardService extends BaseService {
  constructor(){
    super()
  }


  async get () {
    const total_day=  (await OrderService.getTotal({option: "day"})).total
    const total_week=  (await OrderService.getTotal({option: "week"})).total
    const total_month=  (await OrderService.getTotal({option: "month"})).total
    const total_year=  (await OrderService.getTotal({option: "year"})).total
    const total_employee = (await UserService.list({is_paging: false, type: 2})).length
    const total_customer = (await UserService.list({is_paging: false, type: 0})).length
    const total_product = (await ProductService.list({is_paging: false})).length
    const last_and_currentYear = (await OrderService.getComparison())
    console.log()
    return {total_day, total_week, total_month, total_year, total_employee, total_customer, total_product, last_and_currentYear}
  }
}
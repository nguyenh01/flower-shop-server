'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const ImportHistory = require('../models/importHistory.model.js')

module.exports = class ImportHistoryService extends BaseService {
  constructor(){
    super()
  }

  async create (importHistoryInfo) {
    const {product_id, quantity, unitPrice, note} = importHistoryInfo;
    console.log('dsadsadsadsadsa')
    const importHistoryCreate = await ImportHistory.create({
      product_id, date: moment().format(), quantity, unitPrice, note, totalPrice: quantity * unitPrice
    });
    console.log('this is cấdsasa', categoryCreate)
    return importHistoryCreate
  }

  async get (importHistoryFilters) {
    const {_id, product_id, date, quantity, unitPrice} = importHistoryFilters;
    let result
    if (_id) {
       result = await ImportHistory.findById(_id)
    }
    else {
      let filters = {}
      if (product_id) {
        filters[product_id] = product_id
      }
      if (date) {
        filters[date] = date
      }
      if (quantity) {
        filters[quantity] = quantity
      }
      if (unitPrice) {
        filters[unitPrice] = unitPrice
      }
      result = await Category.find(filters)
    }

    return result
  }

}
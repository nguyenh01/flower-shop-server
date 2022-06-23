'use strict';

const createError = require('http-errors');
const BaseService = require('./base.service')
const Category = require('../models/category.model.js')

module.exports = class CategoryService extends BaseService {
  constructor(){
    super()
  }

  async create (categoryInfo) {
    const {name, description} = categoryInfo;
    console.log('dsadsadsadsadsa')
    const categoryCreate = await Category.create({
      name: name,
      description: description,
    });
    console.log('this is cấdsasa', categoryCreate)
    return categoryCreate
  }

  async get (categoryInfo) {
    const {_id} = categoryInfo;
    let result
    if (_id) {
       result = await Category.findById(_id)
    }
    else {
      let filters = {}
      result = await Category.find(filters)
    }

    return result
  }

}
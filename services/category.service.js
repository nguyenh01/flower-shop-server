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
    const categoryCreate = await Category.create({
      name: name,
      description: description,
    });
    return categoryCreate
  }

  async get ({page, size, _id, name, sort, direction, is_paging = false}) {
    let result
    const pageParam = parseInt(page)
    const sizeParam = parseInt(size)
    // Get by id
    if (_id) {
      result = await Category.findById(_id)
      return result
   }
   // List all
   else {
    let sorts = {}
    let filters = {}
    if (sort && direction) {
      switch(direction) {
        case 'desc':
          sorts[sort] = -1;
          break;
        case 'asc':
          sorts[sort] = 1;
          break;
        default:
          sorts['name'] = 1;
          break;
      }
    }

    if (name) {
      filters['name'] = {$regex : new RegExp(name, "i")}
    }
    const total = await Category.find(filters).sort(sorts)
    if (is_paging) {
      const skip = (page - 1) * size
      result = await Category.find(filters).sort(sorts).skip(skip).limit(size);
      let number_page = 0
      if (total.length/size - total.length%size >= 0.5)
      {
          number_page = Math.ceil(parseInt((total.length / size - 0.5))) + 1
      }
      else
      {
          number_page = Math.ceil((total.length/size))
      }
      return {result, page_size: size, total_element: total.length, total_page: number_page, page: page}
    } else {
      result = total
      return result
    }
    }
  }

  async update (categoryInfo) {
    const {_id, name, description} = categoryInfo;
    return await Category.updateOne({_id: _id}, {name, description})
  }

}
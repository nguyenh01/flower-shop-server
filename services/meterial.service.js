'use strict';

const createError = require('http-errors');
const BaseService = require('./base.service')
const Material = require('../models/material.model.js')
const ProductService = require('../services/product.service').getInstance()

module.exports = class MaterialService extends BaseService {
  constructor(){
    super()
  }

  async create (materialInfo) {
    const {name, description} = materialInfo;
    const materialCreate = await Material.create({
      name: name,
      description: description,
    });
    return materialCreate
  }

  async get ({page = 1, size = 9, _id, name, sort, direction, is_paging = true, num = 3}) {
    const pageParam = parseInt(page)
    const sizeParam = parseInt(size)
    const is_pagingParam = JSON.parse(is_paging)
    let result
    // Get by id
    if (_id) {
      result = await Material.findById(_id)
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
      const total = await Material.find(filters).sort(sorts)
      if (is_pagingParam) {
        const skip = (pageParam - 1) * sizeParam
        result = await Material.find(filters).sort(sorts).skip(skip).limit(sizeParam);
        let number_page = 0
        if (total.length/size - total.length%size >= 0.5)
        {
            number_page = Math.ceil(parseInt((total.length / sizeParam - 0.5))) + 1
        }
        else
        {
            number_page = Math.ceil((total.length/sizeParam))
        }
        return {result, page_size: sizeParam, total_element: total.length, total_page: number_page, page: pageParam}
      } else {
        result = total
        return result
      }
    }
  }

  async update (materialInfo) {
    const {_id, name, description} = materialInfo;
    return await Material.updateOne({_id: _id}, {name, description})
  }

  async delete (id) {
    return await Material.deleteOne({_id: id})
  }
}
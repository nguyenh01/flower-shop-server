'use strict';

const createError = require('http-errors');
const BaseService = require('./base.service')
const Material = require('../models/material.model.js')

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

  async get (materialInfo) {
    const {_id} = materialInfo;
    let result
    if (_id) {
       result = await Material.findById(_id)
    }
    else {
      let filters = {}
      result = await Material.find(filters)
    }

    return result
  }

  async update (materialInfo) {
    const {_id, name, description} = materialInfo;
    return await Material.updateOne({_id: _id}, {name, description})
  }
}
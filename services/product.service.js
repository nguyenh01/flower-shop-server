'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const Product = require('../models/product.model.js')

module.exports = class ProductService extends BaseService {
  constructor(){
    super()
  }

  async create (productInfo, files) {
    try {
      const {cate_id, mate_id, name, price, description, unitsinstock = 0} = productInfo;
      let imageList = []
      if (!files) {
        const error = new Error('Please choose file');
        error.httpStatusCode = 400;
        return
      }
      files.map((file) => {
        // let img = fs.readFileSync(file.path)
        console.log('this is path', file.destination)
        // const path = file.destination.split('server\\')[1]
        // const newPath = path.split('\\').join('/')
        imageList.push(file.destination + "/" + file.filename)
      })
      const product = {cate_id, mate_id, name, price, unitsinstock, description, imageList}
      const productCreate = await Product.create(product);
      return productCreate
    }
    catch(err)
    {
      console.log(err)
      // return next(err)
    }
  }

  async get ({cate_id, mate_id, name, page, size, order_by, is_instock}) {
    const pageParam = page ? page : 1
    const sizeParam = size ? size : 9
    let filters = {}
    let sort = {}

    if (cate_id) {
      filters['cate_id'] = {$in: cate_id}
    }
    if (mate_id) {
      filters['mate_id'] = {$in: mate_id}
    }
    if (is_instock?.length == 1) {
      if (JSON.parse(is_instock[0]) === true) {
        filters['unitsinstock'] = {$gte: 1}
      }
      else if (JSON.parse(is_instock[0]) === false) {
        filters['unitsinstock'] = 0
      }
    }
    if(name) {
      filters['name'] = {$regex : new RegExp(name, "i")}
    }
    switch(order_by) {
      case 'z-a':
        sort['name'] = -1;
        break;
      case 'low':
        sort['price'] = 1;
        break;
      case 'high':
        sort['price'] = -1;
        break;
      default:
        sort['name'] = 1;
        break;
    }

    const skip = (pageParam - 1) * sizeParam
    const total = await Product.find(filters).sort(sort)
    const result = await Product.find(filters).sort(sort).skip(skip).limit(sizeParam);
    let number_page = 0
    if (total.length/sizeParam - total.length%sizeParam >= 0.5)
    {
        number_page = Math.ceil(parseInt((total.length / sizeParam - 0.5))) + 1
    }
    else
    {
        number_page = Math.ceil((total.length/sizeParam))
    }
    return {result, page_size: sizeParam, total_element: total.length, total_page: number_page, page: pageParam}
  }

  async getById(id) {
    const result = await Product.findById(id)
    return result
  }

}
'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const Product = require('../models/product.model.js')
const Material = require('../models/material.model.js')
const Category = require('../models/category.model.js')
const ShoppingCartDetail = require('../models/shoppingCartDetail.model.js');

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
        const path = file.destination.split('/app/')[1]
        imageList.push(path + "/" + file.filename)
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

  async get ({cate_id, mate_id, name, page, size, order_by, is_instock, sort, direction}) {
    const pageParam = page ? page : 1
    const sizeParam = size ? size : 9
    let filters = {}
    let sorts = {}

    if (cate_id) {
      filters['cate_id'] = {$in: cate_id}
    }
    if (mate_id) {
      filters['mate_id'] = {$in: mate_id}
    }
    console.log(filters)
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
    } else {
      switch(order_by) {
        case 'z-a':
          sorts['name'] = -1;
          break;
        case 'low':
          sorts['price'] = 1;
          break;
        case 'high':
          sorts['price'] = -1;
          break;
        default:
          sorts['name'] = 1;
          break;
      }
    }

    const skip = (pageParam - 1) * sizeParam
    const total = await Product.find(filters).sort(sorts)
    const productInfos = await Product.find(filters).sort(sorts).skip(skip).limit(sizeParam);
    let number_page = 0
    if (total.length/sizeParam - total.length%sizeParam >= 0.5)
    {
        number_page = Math.ceil(parseInt((total.length / sizeParam - 0.5))) + 1
    }
    else
    {
        number_page = Math.ceil((total.length/sizeParam))
    }
    const materialsInfo = await Material.find()
    const categoriesInfo = await Category.find()
    const result = productInfos.map((product) => {
      const productUpdate = {...product._doc}
      productUpdate['material_name'] = materialsInfo.find((item) => item._id.toString() == product.mate_id).name
      productUpdate['caterial_name'] = categoriesInfo.find((item) => item._id.toString() == product.cate_id).name
      return productUpdate
    })
    console.log(result)
    return {result: result, page_size: sizeParam, total_element: total.length, total_page: number_page, page: pageParam}
  }

  async getById(id) {
    const result = await Product.findById(id)
    return result
  }

  async updateProduct(productInfo, files) {
    const {id, cate_id, mate_id, name, price, unitsinstock, description} = productInfo
    let imageList = []
    console.log('this is', files)
    if (!files) {
      const error = new Error('Please choose file');
      error.httpStatusCode = 400;
      return
    }
    files.map((file) => {
      const path = file.destination.split('/app/')[1]
      imageList.push(path + "/" + file.filename)
    })
    let productUpdateInfo = {
      cate_id,
      mate_id,
      name,
      price,
      unitsinstock, 
      description
    }
    if (imageList.length > 0) {
      productUpdateInfo['imageList'] = imageList
    }
    return await Product.findOneAndUpdate({_id: id}, productUpdateInfo)
  }

  async delete(id) {
    try {
      const productInfo = Product.findById(id)
      productInfo?.imageList?.forEach(async element => {
        return await fs.unlink(element);        
      });
      await Promise.all([ShoppingCartDetail.deleteMany({product_id: id}), Product.deleteOne({_id: id})])
      return "Xóa thành công"
    } catch (err)
    {
      throw new Error(err)
    }
  }
}
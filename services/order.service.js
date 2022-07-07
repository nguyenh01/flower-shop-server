'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const ShipFeeService = require('./shipFee.service').getInstance()
const ProductService = require('./product.service').getInstance()
const ShoppingCartService = require('./shoppingCart.service').getInstance()
const Product = require('../models/product.model.js')
const Order = require('../models/order.model.js')
const OrderDetail = require('../models/orderDetail.model.js')

module.exports = class OrderService extends BaseService {
  constructor(){
    super()
  }

  async create(OrderInfo) {
    try {
      console.log('hello')
      //Begin == Create order//
      const {note, first_name, last_name, phone, address, to_district_id, to_ward_code, item, email, id_customer} = OrderInfo //id_customer đăng nhập thì truyền
      const to_district_id_param = parseInt(to_district_id)
      const to_ward_code_param = to_ward_code
      const shipFee = (await ShipFeeService.getShipFee(to_district_id_param, to_ward_code_param))?.data?.total
      let products 
      let is_not_enough;
      let total_fee = shipFee;
      let id_customer_main = id_customer;
      let product_list_info = []
      if(item!=null)
      {
        products = item
        
        for(let i = 0; i < products.length; i++)
        {
          is_not_enough = await Product.findOne({_id:products[i].id, unitsinstock: {$lt:products[i].quantity}})
          if (is_not_enough)
          {
            return {is_completed: false, msg:"Không đủ số lượng sản phẩm"}
          }
          const productInfo = await ProductService.getById(products[i].id)
          product_list_info.push(productInfo)
          total_fee += productInfo?.price * products[i].quantity
        }
      }

      if(id_customer == null)
      {
          id_customer_main = "";
      }
      //Begin==Create Order//
      const orderInfo = await Order.create({
        customer_id: id_customer_main,
        note:note,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        address: address,
        email: email,
        employee_id: "",
        order_date: moment().format('DD/MM/YYYY'),
        ship_date: "",
        ship_fee: shipFee,
        product_fee: total_fee - shipFee,
        total_fee: total_fee,
        payed: false,
        status: 0,
        district_id: to_district_id,
        ward_code: to_ward_code
      })

      //End==Create Order//

      //Begin==Create OrderDetail//
      products.forEach(product => {
        OrderDetail.create({
          order_id: orderInfo._id.toString(),
          product_id: product.id,
          quantity:product.quantity,
        })
      });
      if (id_customer_main) {
        console.log('this is id', id_customer_main)

        const shoppingCartID = (await ShoppingCartService.getShoppingCartByCusId(id_customer_main))._id.toString()
        console.log('this is shoppingCartID', shoppingCartID), 
        ShoppingCartService.deleteShoppingCartByUserId({cus_id: id_customer_main})
        ShoppingCartService.deleteShoppingCartDetailBySCId({shoppingCart_id: shoppingCartID})
      }

      return {is_completed: true, msg: "Giao dịch thành công"}
    //End == Create order //
    }
    catch (err) {
      console.log(err.message)
      throw Error(error)
    }
  }
  async get({option = 'day'}) {
    const currentDate = moment();
    const total_order = Order.find({status:2})
    let result;
    switch(option) {
      case 'day':
        result = total_order.filter((element) => {currentDate.isSame(moment(element.completed_date))})
        break;
      case 'month':
        result = total_order.filter((element) => {currentDate.isSame(moment(element.completed_date), 'year') && currentDate.isSame(moment(element.completed_date), 'month')})
        break;
      case 'year':
        result = total_order.filter((element) => {currentDate.isSame(moment(element.completed_date), 'year')})
        break;
      default:
        break;
    }
    return result;
  }
  async getById(id) {
    const orderInfo = await Order.findById(id)
    const orderDetailInfo = await OrderDetail.find({order_id: id})
    return {orderInfo, orderDetailInfo}
  }

  async list ({page, size, sort, direction, cus_id, status}) {
    const pageParam = page ? page : 1
    const sizeParam = size ? size : 9
    let filters = {}
    let sorts = {}


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

    if (cus_id) {
      filters['customer_id'] = cus_id;
    }
    if (status) {
      filters['status'] = status
    }

    const skip = (pageParam - 1) * sizeParam
    const total = await Order.find(filters).sort(sorts)
    const result = await Order.find(filters).sort(sorts).skip(skip).limit(sizeParam);
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
}
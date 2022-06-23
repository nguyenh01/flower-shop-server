'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const fetch = require('node-fetch')
const Token = process.env.SHOP_ADDRESS_TOKEN
const ShopId = process.env.SHOP_ID
const from_district_id = process.env.FROM_DISTRICT_ID
const service_type_id = process.env.SERVICE_TYPE_ID

module.exports = class ShipFeeService extends BaseService {
  constructor(){
    super()
  }

  async getShipFee (to_district_id, to_ward_code) {
    try {
      return await fetch("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",{
        method:'post',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Token':Token,
            'ShopId':parseInt(ShopId),
        },
        body: JSON.stringify({
            from_district_id:parseInt(from_district_id),
            service_type_id: parseInt(service_type_id),
            to_district_id:parseInt(to_district_id),
            to_ward_code:to_ward_code,
            heigt:50,
            length:20,
            weight:200,
            width:20,
            insurance_fee:0,
            coupon:null
        })
      })
      .then(res => res.json())
    }
    catch (err) {
      console.log(err.message)
    }
  }

}
'use strict';

const moment = require('moment')
const createError = require('http-errors');
const BaseService = require('./base.service')
const fetch = require('node-fetch')
const Token = process.env.SHOP_ADDRESS_TOKEN
const ShopId = process.env.SHOP_ID
const from_district_id = process.env.FROM_DISTRICT_ID
const from_ward_code = process.env.FROM_WARD_CODE
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

    //Begin==Estimate delivery time////
    async getExptedDeliveryTime ({to_district_id, to_ward_code, service_id}) {
      try {
        await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime",
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Token: Token,
              ShopId: parseInt(ShopId),
            },
            body: JSON.stringify({
              from_district_id: parseInt(from_district_id),
              from_ward_code: parseInt(from_ward_code),
              service_type_id: parseInt(service_type_id),
              to_district_id: parseInt(to_district_id),
              to_ward_code: to_ward_code,
            }),
          }
        )
          .then((res) => res.json())
          .then((json) => {
            return res
              .status(200)
              .json({
                msg: "Lấy danh sách thông tin địa chỉ",
                result: { ship_fee: json.data.service_fee },
              });
          });
      } catch (error) {
        console.log(error.message);
        return error;
      }
    };
    //End==Get ship fee

}
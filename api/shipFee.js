// const express = require('express');
const fetch = require("node-fetch");
const Token = process.env.SHOP_ADDRESS_TOKEN;
const ShopId = process.env.SHOP_ID;
const from_district_id = process.env.FROM_DISTRICT_ID;
const service_type_id = process.env.SERVICE_TYPE_ID;
module.exports = (router) => {
  //Begin==Get Provinces//
  router.get("/province", async (req, res) => {
    try {
      await fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Token: Token,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const result = json.data.map((province) => ({
            ProvinceID: province.ProvinceID,
            ProvinceName: province.ProvinceName,
          }));
          return res
            .status(200)
            .json({ msg: "Lấy danh sách thông tin địa chỉ", result: result });
        });
    } catch (err) {
      return err.message;
    }
  });
  //End==Get Provinces//

  //Begin==Get Districts//
  router.get("/district/:province_id", async (req, res) => {
    try {
      const { province_id } = req.params;
      await fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Token: Token,
          },
          body: JSON.stringify({ province_id: parseInt(province_id) }),
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const result = json.data.map((district) => ({
            DistrictID: district.DistrictID,
            DistrictName: district.DistrictName,
          }));
          return res
            .status(200)
            .json({ msg: "Lấy danh sách thông tin địa chỉ", result });
        });
    } catch (error) {
      console.log(error.message);
      return error;
    }
  });
  //End==Get Districts//

  //Begin==Get Ward//
  router.get("/ward/:district_id", async (req, res) => {
    try {
      const { district_id } = req.params;
      await fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Token: Token,
          },
          body: JSON.stringify({ district_id: parseInt(district_id) }),
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const result = json.data.map((ward) => ({
            WardName: ward.WardName,
            WardCode: ward.WardCode,
          }));
          return res
            .status(200)
            .json({ msg: "Lấy danh sách thông tin địa chỉ", result });
        });
    } catch (error) {
      console.log(error.message);
      return error;
    }
  });
  //End==Get Ward//

  //Begin==Get ship fee////
  router.post("/getshipfee", async (req, res) => {
    try {
      const { to_district_id, to_ward_code } = req.body;

      await fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
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
            service_type_id: parseInt(service_type_id),
            to_district_id: parseInt(to_district_id),
            to_ward_code: to_ward_code,
            heigt: 50,
            length: 20,
            weight: 200,
            width: 20,
            insurance_fee: 0,
            coupon: null,
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
  });
  //End==Get ship fee
};

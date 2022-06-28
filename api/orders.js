// const multer = require('multer')
const moment = require('moment')
// const upload = multer({ dest: '../public/assets/images/products/uploads/' })
// const fetch = require('node-fetch')
// const validator = require('../middlewares/validator')
const ProductService = require('../services/product.service').getInstance()
const ShipFeeService = require('../services/shipFee.service').getInstance()
const Product = require('../models/product.model.js')
const Order = require('../models/order.model.js')
const OrderDetail = require('../models/orderDetail.model.js')
const OrderService = require('../services/order.service')

module.exports = (router) => { 
  router.post('/create', async (req, res, next) => {
		try {
			const result = await OrderService.create(req.body)
			if (result.is_completed) {
				return res.status(200).json({msg:result.message})
			}
			return res.status(400).json({msg:result.message})
		}
		catch (err) {
			console.log(err.message)
			return res.status(500).json(err.message)
		}
  })
}
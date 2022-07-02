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
const OrderService = require('../services/order.service').getInstance()

module.exports = (router) => { 
  router.post('/create', async (req, res, next) => {
		try {
			const result = await OrderService.create(req.body)
			console.log('this is result', result)
			if (result.is_completed) {
				return res.status(200).json({msg:result.msg})
			}
			return res.status(400).json({msg:result.msg})
		}
		catch (err) {
			console.log(err.message)
			return res.status(500).json(err.message)
		}
  })
	// router.get('/', async (req, res, next) => {
	// 	try {
  //     const page = parseInt(req.query.page);
  //     const size = parseInt(req.query.size);
  //     const cate_id = req.query.cate_id?.split(",");
  //     const mate_id = req.query.mate_id?.split(",");
  //     const { order_by, name, sort, direction } = req.query;
  //     const is_instock = req.query.is_instock?.split(",")
  //     const result = await ProductService.get({
  //       order_by,
  //       is_instock,
  //       mate_id,
  //       cate_id,
  //       name,
  //       page,
  //       size,
  //       sort,
  //       direction,
  //     });
  //     return res.status(200).json({
  //       data: result,
  //     });
	// 	}
	// 	catch (err) {
	// 		console.log(err.message)
	// 		return res.status(500).json(err.message)
	// 	}
  // })
}
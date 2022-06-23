const multer = require('multer')
// const upload = multer({ dest: '../public/assets/images/products/uploads/' })
const fetch = require('node-fetch')
const store = require('../middlewares/multer')
const validator = require('../middlewares/validator')
const ProductService = require('../services/product.service').getInstance()
const ShipFeeService = require('../services/shipFee.service').getInstance()
const Product = require('../models/product.model.js')
const Order = require('../models/order.model.js')
const OrderDetail = require('../models/orderDetail.model.js')
const Token = process.env.SHOP_ADDRESS_TOKEN
const ShopId = process.env.SHOP_ID
const from_district_id = process.env.FROM_DISTRICT_ID
const service_type_id = process.env.SERVICE_TYPE_ID

module.exports = (router) => { 
  router.post('/create', async (req, res, next) => {
		try {
			//Begin == Create order//
			const {note, first_name, last_name, phone, address, to_district_id, to_ward_code, item, email, id_customer} = req.body //id_customer đăng nhập thì truyền
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
				console.log('this is products', products)
				
				for(let i = 0; i < products.length; i++)
				{
					is_not_enough = await Product.findOne({_id:products[i].id, unitsinstock: {$lt:products[i].quantity}})
					if (is_not_enough)
					{
						console.log(is_not_enough)
						return res.json({code:0,msg:"Không đủ số lượng sản phẩm"})
					}
					productInfo = await ProductService.getById(products[i].id)
					product_list_info.push(productInfo)
					// total_fee += productInfo?.price * products[i].quantity
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
				order_date: new Date(),
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


		return res.json({msg:"Giao dịch thành công"});
			//End == Create order //
		}
		catch (err) {
			console.log(err.message)
		}
  })
}
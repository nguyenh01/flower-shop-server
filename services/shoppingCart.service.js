const BaseService = require('./base.service')
const Product = require('../models/product.model.js')
const ShoppingCart = require('../models/shoppingCart.model.js');
const ShoppingCartDetail = require('../models/shoppingCartDetail.model.js');


module.exports = class ShoppingCartService extends BaseService {
  constructor(){
    super()
  }

  async getShoppingCartByCusId (cus_id) {
    try {
      const result =  await ShoppingCart.findOne({cus_id:cus_id});
      return result
    }
    catch(err) {
      console.log(err.message)
    }
  };

  async deleteShoppingCartDetail ({product_id, cus_id}) {
    try {
      if (product_id) {
        const is_delete_shoppingCartDetail = await ShoppingCartDetail.deleteOne({cus_id: cus_id})
        return is_delete_shoppingCartDetail
      } else {
        const shopping_cart_id = (await ShoppingCart.findOne({cus_id: cus_id}))._id
        const is_delete_shoppingCart = await ShoppingCart.findByIdAndDelete(shopping_cart_id)
        const is_delete_shoppingCartDetail = await ShoppingCartDetail.deleteMany({shoppingCart_id: shopping_cart_id})
        return {is_delete_shoppingCart, is_delete_shoppingCartDetail}
      }
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async deleteShoppingCartByUserId ({cus_id}) {
    try {
        return await ShoppingCart.deleteOne({cus_id: cus_id})
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async deleteShoppingCartDetailBySCId ({shoppingCart_id}) {
    try {
        const result =  await ShoppingCartDetail.deleteMany({shoppingCart_id: shoppingCart_id})
        console.log('this í test', result, shoppingCart_id)
        return result
    }
    catch(err) {
      console.log(err.message)
    }
  }

  async getListShoppingCartDetailByShoppingCardId (shopping_cart_id) {
    try {
      let shoppingCartDetails =  await ShoppingCartDetail.find({shoppingCart_id:shopping_cart_id})
      let products = await Product.find()
      shoppingCartDetails.map(function (shoppingCartDetail) {
        shoppingCartDetail.imageList = products.find(item => item._id.toString() == shoppingCartDetail.product_id).imageList
      })
      return shoppingCartDetails
    }
    catch(err) {
      console.log(err.message)
    }
  };

  async updateShoppingCartDetail ({shoppingCart, product_id, quantity, cus_id}) {
    try {

      const productInfo = await Product.findOne({_id: product_id})
      let shoppingCartDetail;
      if (!shoppingCart) // Chưa tồn tại giỏ hàng
      {
        shoppingCart = await ShoppingCart.create({
          cus_id:cus_id,
        });
      }
      const existProductInShoppingCart = await ShoppingCartDetail.findOne({shoppingCart_id: shoppingCart._id, product_id: product_id})
      if (existProductInShoppingCart) {
        shoppingCartDetail = await ShoppingCartDetail.findOneAndUpdate({shoppingCart_id:shoppingCart._id, product_id:product_id}, 
          { quantity: existProductInShoppingCart.quantity + quantity, total: existProductInShoppingCart.total + quantity * productInfo.price}, {new: true})
      } else {
        shoppingCartDetail = await ShoppingCartDetail.create({
          shoppingCart_id:shoppingCart._id.toString(),
          product_id:product_id,
          quantity:quantity,
          product_name: productInfo.name,
          unit_price: productInfo.price,
          total: quantity * productInfo.price,
        })
        console.log('this hello', shoppingCartDetail)

      }
      return {shoppingCart, shoppingCartDetail}
    }
    catch (err) {
      console.log(err.message)
    }
  };

  async updateProduct (cus_id, carts) {
    try {
      const shoppingCartInfo = await ShoppingCart.findOne({cus_id: cus_id})
      carts.forEach(async function(cart) {
        const productInfo = await Product.findOne({_id: cart.product_id})
        await ShoppingCartDetail.findOneAndUpdate({shoppingCart_id: shoppingCartInfo._id.toString(), product_id: cart.product_id}, {quantity: cart.quantity, total: productInfo.price * cart.quantity})
      })
    } catch (e) {
      console.log(e.message)
    }
  }


}
const validator = require('../middlewares/validator')
const ShoppingCartService = require('../services/shoppingCart.service').getInstance()

module.exports = (router) => {
    // //Begin == Thay đổi số lượng hàng trong giỏ hàng //
    // router.put('/updateProduct', async (req,res)=>{
    //     try {
    //         const {shoppingCartDetailId, product_id, quantity} = req.body
    //         const result = await ShoppingCartService.updateProduct ({shoppingCartDetailId, product_id: product_id, quantity: quantity})
    
    //         return res.json({code:200,message:"Cập nhật giỏ hàng thành công", result});
    //     }
    //     catch(e)
    //     {
    //         console.log(e.message)
    //     }
    //     })
    //     //End == Thêm vào giỏ hàng //
}
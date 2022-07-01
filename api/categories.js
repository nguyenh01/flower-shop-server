const validator = require('../middlewares/validator')
const CategoryService = require('../services/category.service').getInstance()
const ProductService = require('../services/product.service').getInstance()

module.exports = (router) => { 
  router.post('/create',
    validator({
      name: {
        type: 'string',
        required: true
      },
      description: {
        type: 'string',
        required: false
      }
    }), 
    async (req, res, next) => {
      try {
        const result = await CategoryService.create(req.body)
        return res.status(200).json({ 
          data: result
        })
      }
      catch(error) {
				console.log(error)
        next(error);
      }
    }),

    router.get('/',
    async (req, res, next) => {
      try {
        const result = await CategoryService.get(req.query)
        return res.status(200).json({ 
          data: result
        })
      }
      catch(error) {
				console.log(error)
        next(error);
      }
    }),

    router.put('/',
    async (req, res, next) => {
      try {
        await CategoryService.update(req.body)
        return res.status(200).json({ 
          msg: "Cập nhật thành công"
        })
      }
      catch(error) {
				console.log(error)
        next(error);
      }
    }),

    router.delete('/:id',
    async (req, res, next) => {
      try {
        const id = req.params.id
        console.log('this is id', id)
        const isExistedProducts = await ProductService.get({
          mate_id: id
        })
        console.log(isExistedProducts)
        if (isExistedProducts.result.length > 0) {
          return res.status(400).json({ 
            msg: "Không thể xóa chất liệu sản phẩm này vì có một số sản phẩm thuộc chất liệu này!!!",
            products:  isExistedProducts.result
          })
        }
        const result = await CategoryService.delete(id) 
        return res.status(200).json({ 
          data: result
        })
      }
      catch(error) {
        console.log(error)
        next(error);
      }
    })
}
const validator = require('../middlewares/validator')
const MaterialService = require('../services/meterial.service').getInstance()

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
        const result = await MaterialService.create(req.body)
        return res.status(200).json({ 
          data: result
        })
      }
      catch(error) {
				console.log(error)
        next(error);
      }
    }),
    router.get('/get',
    async (req, res, next) => {
      try {
        const result = await MaterialService.get(req.body)
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
        await MaterialService.update(req.body)
        return res.status(200).json({ 
          msg: "Cập nhật thành công"
        })
      }
      catch(error) {
				console.log(error)
        next(error);
      }
    })
}
const validator = require('../middlewares/validator')
const ImportHistoryService = require('../services/importHistory.service').getInstance()

module.exports = (router) => { 
  router.post('/create',
    validator({
      product_id: {
        type: 'string',
        required: true
      },
      date: {
          type: 'date',
          required: true
      },
      quantity: {
          type: 'number',
          required: true
      },
      unitPrice: {
          type: 'number',
          required: true
      },
      totalPrice: {
          type: 'number',
          required: true
      },
      note: {
          type: 'string',
          required: false
      }
    }), 
    async (req, res, next) => {
      try {
        const result = await ImportHistoryService.create(req.body)
        console.log('this is result', result)
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
        const result = await ImportHistoryService.get(req.body)
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
const MessageServices = require('../services/message.service').getInstance()
const authorize = require("../middlewares/authorize.js");


module.exports = (router) => { 
  router.get('/', authorize.verifyAccessToken,
    async (req, res, next) => {
      try {
        const userId = req.payload.id
        const message = await MessageServices.getMessagesByCustomerId(userId)
        return res.status(200).json({ 
          message
        })
      }
      catch(error) {
				console.log(error)
        next(error);
      }
  }),

  router.get('/:id', authorize.verifyAccessToken,
  async (req, res, next) => {
    try {
      const type = req.payload.type
      if (type === 2 || type === 3 ) {
        const id = req.params.id
        const message = await MessageServices.getMessagesByCustomerId(id)
        return res.status(200).json({ 
          message
        })
      }
      else {
        return res.status(400).json({ 
          msg: "Bạn không có quyền truy cập!!!"
        })
      }
    }
    catch(error) {
      console.log(error)
      next(error);
    }
})
}
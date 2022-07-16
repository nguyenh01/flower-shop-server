const RevenueService = require('../services/revenue.service').getInstance()
const authorize = require("../middlewares/authorize.js");
// const validator = require('./middleware/validator')
module.exports = (router) => {
    router.get('/',
    authorize.verifyAccessToken,
        async (req, res) => {
            try {
                const type = req.payload.type
                const {option, selectedDate} = req.query
                console.log(type)
                if (type != 3) {
                    return res.status(400).json("Không có quyền truy cập")
                }
                const result = await RevenueService.get({option, selectedDate})
                console.log('controller', result)
                return res.status(200).json(result)
            }
            catch (error) {
                console.log(error.message)
                throw Error(error)
            }
        }
    )
}
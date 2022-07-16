const StatisticalService = require('../services/statistical.service').getInstance()
const authorize = require("../middlewares/authorize.js");
// const validator = require('./middleware/validator')
module.exports = (router) => {
    router.get('/:option',
    authorize.verifyAccessToken,
        (req, res) => {
            const type = req.payload.type
            console.log(type)
            if (type != 3) {
                return res.status(400).json("Không có quyền truy cập")
            }
            const {option} = req.params
            const result = StatisticalService.get(option)
            res.json(result)
        }
    )
}
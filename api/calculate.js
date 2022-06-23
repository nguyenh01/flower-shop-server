// const CaculateService = require('../service/caculate-service')
// const validator = require('./middleware/validator')
// module.exports = (router) => {
//     const service = CaculateService.getInstance()
//     router.get('/:a/:b',
//         validator({
//             a: {
//                 type: 'number'
//             },
//             b: {
//                 type: 'string'
//             }
//         }),
//         (req, res) => {
//             const {a, b} = req.params
//             const result = service.sum({a, b})
//             res.json(result)
//         }
//     )
// }
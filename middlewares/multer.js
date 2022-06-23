const multer = require('multer')
const path = require('path')

//set storage
let storage = multer.diskStorage({
    destination: function(req, file , cb){
        cb(null, path.join(__dirname, '../public/assets/images/uploads'))
        console.log('this is cb', cb)
    },
    filename: function(req, file, cb){
        //image.jpg
        console.log('file', file)
        let ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

module.exports = store = multer({storage: storage})
